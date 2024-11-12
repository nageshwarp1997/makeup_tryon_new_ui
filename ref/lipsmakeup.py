# -*- coding: utf-8 -*-
"""
Created on Thu Sep  5 17:00:23 2024

@author: Jayapriya
"""
import cv2
import numpy as np
 

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




def lip_makeup(src: np.ndarray, points: np.ndarray, upper_lip_points: np.ndarray, lower_lip_points: np.ndarray, color: list ):
     
    
    #new lip mask
    nlipmask =  np.zeros(src.shape[:2], dtype=np.uint8)
     
    cv2.fillPoly(nlipmask, [points], 1)
    kernel = np.ones((3, 3), np.uint8)
    nlipmask = cv2.dilate(nlipmask, kernel, iterations=1)
    
    nlipmask = cv2.erode(nlipmask, kernel, iterations=1)
     
    output = src
    
    #mediapipe mask
   
    clipmask =   nlipmask.astype(np.uint8)  
      
    clipmask[clipmask>=1]=1
    
     
    # Define the matte lip color in RGBA
    matte_color = color  # Red with alpha value 150    (70, 62, 200, 255)  ()
    
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
    

    
    
    
    
   
    darkening_factor = 1
    
    r, g, b =  rgb_color
    r = int(r * darkening_factor)
    g = int(g * darkening_factor)
    b = int(b * darkening_factor)
    
    # output = draw_lip_liner(output, upper_lip_points, color=(r, g, b), thickness=1)  # Upper lip in red
    # output = draw_lip_liner(output, lower_lip_points, color=(r, g, b), thickness=1)
    
    return output