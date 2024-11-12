import cv2
import numpy as np
from landmarks import detect_landmarks, normalize_landmarks, plot_landmarks, normalize_landmarksf
from mediapipe.python.solutions.face_detection import FaceDetection
import os

from typing import List, Iterable

import torch
from torch import nn
from transformers import SegformerImageProcessor, SegformerForSemanticSegmentation
import cv2 
import matplotlib.pyplot as plt
import requests
import numpy as np
import tkinter as tk
from tkinter import filedialog
from PIL import Image, ImageTk
import random
# Determine the device to use (GPU if available)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load the model and processor
image_processor = SegformerImageProcessor.from_pretrained("jonathandinu/face-parsing")
model = SegformerForSemanticSegmentation.from_pretrained("jonathandinu/face-parsing")
model.to(device)

             
             
upper_lip = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291,308, 415, 311, 312,13,82,81,80,191,78]
lower_lip = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324,318,402,317,14,87,178,88,95,78]         
          








face_conn = [10, 338, 297, 332, 284, 251, 389, 264, 447, 376, 433, 288, 367, 397, 365, 379, 378, 400, 377, 152,
             148, 176, 149, 150, 136, 172, 138, 213, 147, 234, 127, 162, 21, 54, 103, 67, 109,
             ]








          
 
cheeks = [425, 205]  



lei = [474, 475, 475, 476, 476, 477, 477, 474]
rei =[469, 470, 470, 471, 471, 472, 472, 469,]

left_eyeliner_indices = [ 33, 7 ] #[243, 112, 26, 22, 23, 24, 110, 25, 226, 130, 33, 7, 163, 144, 145, 153, 154, 155, 133, 243]
right_eyeliner_indices=[341 ] #[463, 362, 382, 381, 380, 374, 373, 390, 249, 263, 359, 446, 255, 339, 254, 253, 252, 256, 341, 463]
left_eyeshadow_indices = [226, 247, 30, 29, 27, 28, 56, 190, 243, 173, 157, 158, 159, 160, 161, 246, 33, 130, 226],
right_eyeshadow_indices = [463, 414, 286, 258, 257, 259, 260, 467, 446, 359, 263, 466, 388, 387, 386, 385, 384, 398, 362, 463],
blush_left_indices = [50]
blush_right_indices = [280]

left_eyebrow_indices = [276, 283, 282,  295,  285, 300, 293, 334, 296, 336]
right_eyebrow_indices = [46, 53,52,65,70,63,105,66,107]












# Usage in a loop:

def is_lips_detected(landmarks):
    # Example criteria to check if lips are detected
    lips_indices = list(range(78, 113))
    detected_lips = [landmarks[i] for i in lips_indices if i < len(landmarks)]
    return len(detected_lips) > 5  # Threshold based on your needs

def get_lip_landmarks(ret_landmarks, mask: Iterable = None):
   
            lip_landmarkss = [(point.x, point.y) for point in ret_landmarks  ]
            lip_landmarks =[]
             
            mask= np.array(mask)
            for i in range(0 , mask.shape[0]):
                 lip_landmarks.append( lip_landmarkss[mask[i]]) 
            return lip_landmarks
    
def apply_eyeshadow(image, mask, color1, color2):
    gradient = np.linspace(color1, color2, num=mask.shape[0])
    for i in range(mask.shape[0]):
        image[mask[:, :, 0] == 255] = gradient[i]
    return image 

def apply_makeup(src: np.ndarray, is_stream: bool, feature: int, pframe: np.ndarray, show_landmarks: bool = False, pavgval=[0,0,0], liplandmark_buffer=[]):
    """
    Takes in a source image and applies effects onto it.
    """
    
  
    height, width, _ = src.shape
    feature_landmarks = None
    avgvallips =[0, 0, 0]
    
    ret_landmarks = detect_landmarks(src, is_stream, 0.2)
    

    
    
    
     
    if not (ret_landmarks is None):
            
           
           
           
            
            if feature == 1:
                
            
                tlandmarks = [(lm.x * src.shape[1], lm.y * src.shape[0]) for lm in ret_landmarks]
        
                # Define lip landmarks indices (from MediaPipe Face Mesh)
                lip_indices = list(range(78, 113))  # Indices for the lips
        
                # Check if lip landmarks are detected
                detected_lips = [tlandmarks[i] for i in lip_indices if i < len(tlandmarks)]
                #print(len(detected_lips))
                if detected_lips:
                
         
                    feature_landmarks = normalize_landmarks(ret_landmarks, height, width, upper_lip  + lower_lip)
                    
                   
                    
       
                    mask, avgvallips = lip_mask(src, feature_landmarks, [0,0,255] , pavgval)  #[  neeed [138,105,216] [36,51,255] [153, 0, 157]  [112, 86, 150]
                    
                    #new lip mask
                    nlipmask =  np.zeros(src.shape[:2], dtype=np.uint8)
                    
                   
                    cv2.fillPoly(nlipmask, [feature_landmarks], 1)
                    kernel = np.ones((3, 3), np.uint8)
                    nlipmask = cv2.dilate(nlipmask, kernel, iterations=1)
                    
                    nlipmask = cv2.erode(nlipmask, kernel, iterations=1)
                    
                    
                   
                    
                    
                    output = src
                    
                    #mediapipe mask
                  
                    
                    
                    clipmask =   nlipmask.astype(np.uint8) #fplipmask.astype(np.uint8) +  lipmask.astype(np.uint8) # + lipmask
                    
                    clipmask[clipmask>=1]=1
                    
                    
                  
                   
                    
                  
                    
                    
                 
                     
                                        
                   
                   
                    
                    # Define the matte lip color in RGBA
                    matte_color = (18, 44, 150, 255)  # Red with alpha value 150    (70, 62, 200, 255)  ()
                    
                    #matte_color = (63, 63, 184, 184) 
                    
                    #matte_color = (0.749, 0.224, 0.275, 1.0)
                    # Split the RGBA color into RGB and alpha
                    rgb_color = np.array(matte_color[:3])
                    
    
                    
                    alpha = 0.5 #matte_color[3] / 255.0  # Normalize the alpha value to [0, 1]
                    
                    # Create a matte color layer using the lip mask
                    lip_area = cv2.bitwise_and(src, src, mask=clipmask)
                    matte_lip = (1 - alpha) * lip_area + alpha * np.uint8(np.full_like(lip_area, rgb_color))
                    
                    # Merge the matte lips with the original image
                    matte_lip = np.uint8(matte_lip)
                    
                    invclipmas=np.zeros_like(clipmask,np.uint8)
                    invclipmas[clipmask==0]=1
                    background = cv2.bitwise_and(src,src, mask=invclipmas)
                    #background = cv2.bitwise_and(src,src, mask=clipmask_inv)
                    lipareas = cv2.bitwise_and(matte_lip,matte_lip, mask=clipmask)
                    
                    
                    
                    output1 = cv2.add(background, lipareas)
                    
                    # for saturation
                    saturation_factor = 1 
                    
                    hsv_image = cv2.cvtColor(output1, cv2.COLOR_BGR2HSV)
                    
                    # Split the HSV channels
                    h, s, v = cv2.split(hsv_image)

                   
                    
                    
                    s = s.astype(float)  # Convert to float for scaling
                    s = s * (1 + (saturation_factor - 1) * clipmask)  # Increase saturation based on the mask

                    # Clip the saturation values to the range [0, 255] and convert back to uint8
                    s = np.clip(s, 0, 255).astype(np.uint8)

                    # Merge the HSV channels back
                    enhanced_hsv = cv2.merge([h, s, v])

                    # Convert back to BGR color space
                    enhanced_image = cv2.cvtColor(enhanced_hsv, cv2.COLOR_HSV2BGR)
                   
                    # Feather the mask using Gaussian blur
                    
                    binary_mask = cv2.cvtColor(clipmask*255, cv2.COLOR_GRAY2BGR)
                    feathered_mask =cv2.GaussianBlur(binary_mask, (21, 21), 0)
                    # Normalize the feathered mask to range [0, 1]
                    feathered_mask = feathered_mask / 255.0

                    # Define the shine intensity (e.g., adding 50 to the pixel values)
                    shine_intensity = 0.4250
                    shiny_image = enhanced_image.copy()

                    # Apply the shine intensity to the masked area
                    for i in range(3):  # Loop over the color channels
                        shiny_image[:, :, i] = shiny_image[:, :, i] + (shine_intensity * feathered_mask[:,:,i])

                    # Ensure pixel values are within valid range [0, 255]
                    shiny_image = np.clip(shiny_image, 0, 255).astype(np.uint8)
                    
                    output = shiny_image
                    

                    
                    
                    
                    
                    upper_lip_points = normalize_landmarks(ret_landmarks, height, width, upper_lip)
                    lower_lip_points = normalize_landmarks(ret_landmarks, height, width, lower_lip)
                    darkening_factor = 1
                    
                    r, g, b =  rgb_color
                    r = int(r * darkening_factor)
                    g = int(g * darkening_factor)
                    b = int(b * darkening_factor)
                    # output = draw_lip_liner(output, upper_lip_points, color=(r, g, b), thickness=1)  # Upper lip in red
                    # output = draw_lip_liner(output, lower_lip_points, color=(r, g, b), thickness=1)
                   
                   
                    
                     
                    
                    
              
                    
                    
                else:
                    output = src
                    print("Lips are not detected or not visible.")

            elif feature == 2:   
                 
                  
                           
                  
                   
                             
                      output = src
                      
                      eyesl_landmarks = normalize_landmarks(ret_landmarks, height, width, left_eyeshadow_indices  ) 
                      eyesr_landmarks = normalize_landmarks(ret_landmarks, height, width, right_eyeshadow_indices  ) 
                      
                      if  not(eyesl_landmarks is None) and not(eyesr_landmarks is None):
                      #print(len(detected_lips))
                       
                          eyeslmask =  np.zeros(src.shape , dtype=np.uint8)
                          
                          eyesrmask =  np.zeros(src.shape , dtype=np.uint8)
                          # cv2.fillPoly(eyeslmask, [eyesl_landmarks], (255, 255, 255))
                          
                          # color1 = np.array([101, 124, 170])  # Red
                          # color2 = np.array([196, 211, 227])  # Blue
                          # output = apply_eyeshadow(src, eyeslmask, color1, color2)
                          
                          
     
    
                          # Create a mask for the eyeshadow
                          
                    
                          # Draw the polygon for the left and right eye regions
                          cv2.fillPoly(eyeslmask, [eyesl_landmarks], (255, 255, 255))
                          cv2.fillPoly(eyesrmask, [eyesr_landmarks], (255, 255, 255))
                          
                          non_zero_indicesel =np.where(eyeslmask== [255,255, 255])  
                          non_zero_indiceser =np.where(eyesrmask== [255,255, 255]) 
                          
                          if  not(non_zero_indicesel is None) and not(non_zero_indiceser is None):
                          
                              top_rowl = np.where(eyeslmask== [255,255, 255])[0].min()
                              left_coll=np.where(eyeslmask== [255,255, 255])[1].min()
                              right_coll=np.where(eyeslmask== [255,255, 255])[1].max()
                              bot_rowl = np.where(eyeslmask== [255,255, 255])[0].max()
                              top_rowr = np.where(eyesrmask== [255,255, 255])[0].min()
                              left_colr=np.where(eyesrmask== [255,255, 255])[1].min()
                              right_colr=np.where(eyesrmask== [255,255, 255])[1].max()
                              bot_rowr = np.where(eyesrmask== [255,255, 255])[0].max()
                              
                              if top_rowl < top_rowr: 
                                  top_row = top_rowl
                              else:
                                 top_row = top_rowr 
                              if left_coll < left_colr: 
                                 left_col = left_coll
                              else:
                                 left_col = left_colr
                              if bot_rowl > bot_rowr: 
                                 bot_row = bot_rowl
                              else:
                                 bot_row = bot_rowr 
                              if right_coll < right_colr: 
                                right_col = right_coll
                              else:
                                right_col = right_colr
                        
                    
                          # Define the colors for the gradient
                              # inner_color = (200, 150, 255)  # Light shade
                              # outer_color = (100, 50, 150)   # Dark shade
                              inner_color = (83, 89, 132) #(0, 0, 255)  # (83, 89, 132) # 132, 89, 83(0, 0, 255)  # Light shade
                              outer_color =  (101, 124, 170)  #(0, 255, 0)   #(101, 124, 170)  #(255, 0, 0)   # Dark shade
                        
                              # Create a gradient effect
                              gradient_maskl = np.zeros_like(src)
                              gradient_maskr = np.zeros_like(src)
                              gradient_maskl[np.where(eyeslmask== [255,255, 255])]=1
                              gradient_maskr[np.where(eyesrmask== [255,255, 255])]=1
                              rows, cols, _ = src.shape
                              numrowsl = bot_rowl - top_rowl + 1
                              numrowsr = bot_rowr - top_rowr + 1
                              gradientl = np.linspace(inner_color, outer_color, num=numrowsl)
                              gradientr = np.linspace(inner_color, outer_color, num=numrowsr)
                              
                              if numrowsl > numrowsr:
                                  gradientr[0:len(gradientr)]=  gradientl[0:len(gradientr)]
                              else:
                                   gradientl[0:len(gradientl)]=  gradientr[0:len(gradientl)] 
                                 
                              gradientr  = np.repeat(gradientr[:, np.newaxis, :], cols, axis=1)
                              gradientl  = np.repeat(gradientl[:, np.newaxis, :], cols, axis=1)
                              gradient_maskl[top_rowl:bot_rowl+1, :] = gradientl
                              gradient_maskr[top_rowr:bot_rowr+1, :] = gradientr
                             
                               
                            
                            
                            
                              # Apply the gradient only to the masked area
                              eyelshadow = cv2.bitwise_and(gradient_maskl, eyeslmask)
                              eyershadow = cv2.bitwise_and(gradient_maskr, eyesrmask)
                              
                              eyelshadow= cv2.GaussianBlur(eyelshadow, (15, 15),7)
                              eyershadow= cv2.GaussianBlur(eyershadow, (15, 15), 7)
                              
                              
                              # Blend the eyeshadow with the original image
                              alpha = 0.7  # Adjust transparency
                              output = cv2.addWeighted(src, 1, eyelshadow, alpha, 0)
                              output = cv2.addWeighted(output, 1, eyershadow, alpha, 0)
                          else:
                              output = src
                    
                      else:
                          output = src
 
                   
            elif feature == 3:
                 eyebrowcolor = [1,1,10] 
                 eyebl_landmarks = normalize_landmarks(ret_landmarks, height, width, left_eyebrow_indices  ) 
                         
                 eyelmask = eyeb_mask(src, eyebl_landmarks  )  #[19, 0, 63]  [41, 5, 38]
                 
                 eyebr_landmarks = normalize_landmarks(ret_landmarks, height, width, right_eyebrow_indices  ) 
                 eyermask = eyeb_mask(src, eyebr_landmarks )  #[19, 0, 63]  [41, 5, 38]
                 eyelmaskr = refine_mask(eyelmask, eyebl_landmarks)
                 eyermaskr = refine_mask(eyermask, eyebr_landmarks)
                 
                 output = draw_hair_strands(src, eyelmaskr, (50, 50, 50))
                 output = draw_hair_strands(output, eyermaskr, (50, 50, 50))
                 output = add_noise(output, eyelmaskr)
                 output = add_noise(output, eyermaskr)
                 output = blend_shades(output, eyelmaskr, [(50, 50, 50), (60, 60, 60), (40, 40, 40)])
                 output = blend_shades(output, eyermaskr, [(50, 50, 50), (60, 60, 60), (40, 40, 40)])
                 
                 
                 
                 
            elif feature == 4:
                   
                  
                  output = src
                  
            
                
            else:  # Defaults to blush for any other thing
                output = src
                #output = np.where(src * skin_mask >= 1, gamma_correction(src, 1.75), src)
            # if show_landmarks and face_landmarks is not None:
            #      jj =plot_landmarks(src, face_landmarks, True)
     
    else:
                    output = src
                    print("Pls come to the view.")
   
        #jj =plot_landmarks(src,  cheek_landmarks, True)
    return output,   output 



        
def draw_lip_liner(src: np.ndarray, points: np.ndarray, color:list, thickness=2):
    output = src.copy()
    for i in range(len(points) - 1):
        cv2.line(output, points[i], points[i + 1], color, thickness)
    cv2.line(output, points[-1], points[0], color, thickness)  # Close the loop
    return output
# Draw the lip liner

     


def lip_mask(src: np.ndarray, points: np.ndarray, color: list, pavgval):
    """
    Given a src image, points of lips and a desired color
    Returns a colored mask that can be added to the src
    """
    mask = np.zeros_like(src )  # Create a mask
    
    mask1 = np.zeros(src.shape[:2], np.uint8)
    mask1 = cv2.fillPoly(mask1, [points], 1)
    
    
    

    
    
    if  (not ( mask1.size == 0)  & ( mask1.dtype=='unit8')):
        avgvallips = cv2.mean(src, mask=mask1)[:3]
        if (np.mean(pavgval) != 0 ):
            # print(np.asarray(avgvallips))
            # print(np.asarray(pavgval))
            # print( np.mean(np.asarray(avgvallips)-np.asarray(pavgval)))
            if  (abs(np.mean(np.asarray(avgvallips)-np.asarray(pavgval)) ) < 100) :
                mask = cv2.fillPoly(mask, [points], color)  # Mask for the required facial feature
                mask = cv2.GaussianBlur(mask, (15, 15), 10)
                avgvallips = pavgval
            else:
                mask = np.zeros_like(src ) 
        else:
              avgvallips =  avgvallips
              mask = cv2.fillPoly(mask, [points], color)  # Mask for the required facial feature
              mask = cv2.GaussianBlur(mask, (15, 15), 10)
     
    
    return mask, avgvallips



def eyeb_mask(src: np.ndarray, points: np.ndarray ):
    mask = np.zeros_like(src)  # Mask that will be used for the cheeks
    mask = cv2.fillPoly(mask , [points], 1)  # Mask for the required facial feature
    
    #mask = cv2.GaussianBlur(mask, (7, 7), 5)
     
    
    return mask
    

def refine_mask(mask, points ):
    refined_mask = np.zeros_like(mask)
     
    cv2.polylines(refined_mask, [points], isClosed=True, color=(255, 255, 255), thickness=2)
    return refined_mask
def draw_hair_strands(image, mask, color):
    
    for i in range(0, mask.shape[0], 2):
        for j in range(0, mask.shape[1], 2):
            if mask[i, j] == 255:
                length = np.random.randint(5, 15)
                angle = np.random.uniform(-np.pi/4, np.pi/4)
                x_end = int(i + length * np.cos(angle))
                y_end = int(j + length * np.sin(angle))
                cv2.line(image, (j, i), (y_end, x_end), color, 1)
    return image
def add_noise(image, mask):
    noise = np.random.normal(0, 25, image.shape).astype(np.uint8)
    noisy_image = cv2.add(image, noise, mask=mask)
    return noisy_image


def apply_eyebrow_shade(image, temp_mask, color):
    # Ensure the color is in the correct format
    if len(color) == 3:
        color = np.array(color, dtype=np.uint8)
    else:
        raise ValueError("Color must be a tuple of 3 elements (B, G, R).")
    
    # Create a colored mask
    colored_mask = np.zeros_like(image, dtype=np.uint8)
    colored_mask[temp_mask == 255] = color
    
    # Blend the colored mask with the original image
    alpha = 0.5  # Transparency factor
    shaded_image = cv2.addWeighted(image, 1 - alpha, colored_mask, alpha, 0)
    
    return shaded_image

def blend_shades(image, mask, colors):
    for color in colors:
        temp_mask = (mask == 255).astype(np.uint8) * np.random.randint(0, 2, mask.shape).astype(np.uint8)
        image = apply_eyebrow_shade(image, temp_mask, color)
    return image
