# -*- coding: utf-8 -*-
"""
Created on Thu Sep  5 17:16:47 2024

@author: Jayapriya
"""
import cv2
import numpy as np
 

def eyeshadow_makeup(src: np.ndarray, eyesl_landmarks: np.ndarray,  eyesr_landmarks: np.ndarray,    color: list ):


    eyeslmask =  np.zeros(src.shape , dtype=np.uint8)

    eyesrmask =  np.zeros(src.shape , dtype=np.uint8)
 



    # Create a mask for the eyeshadow


    # Draw the polygon for the left and right eye regions
    cv2.fillPoly(eyeslmask, [eyesl_landmarks], (255, 255, 255))
    cv2.fillPoly(eyesrmask, [eyesr_landmarks], (255, 255, 255))

    non_zero_indicesel =np.where(eyeslmask== [255,255, 255])  
    non_zero_indiceser =np.where(eyesrmask== [255,255, 255]) 

    if  len(non_zero_indicesel[0]) > 0 and len(non_zero_indiceser[0]) > 0 :
        output = src
        top_rowl = np.where(eyeslmask== [255,255, 255])[0].min()
        left_coll=np.where(eyeslmask== [255,255, 255])[1].min()
        right_coll=np.where(eyeslmask== [255,255, 255])[1].max()
        bot_rowl = np.where(eyeslmask== [255,255, 255])[0].max()
        top_rowr = np.where(eyesrmask== [255,255, 255])[0].min()
        left_colr=np.where(eyesrmask== [255,255, 255])[1].min()
        right_colr=np.where(eyesrmask== [255,255, 255])[1].max()
        bot_rowr = np.where(eyesrmask== [255,255, 255])[0].max()
    
    


        # Define the colors for the gradient
        # inner_color = (200, 150, 255)  # Light shade
        # outer_color = (100, 50, 150)   # Dark shade
        inner_color = color #(0, 0, 255)  # (83, 89, 132) # 132, 89, 83(0, 0, 255)  # Light shade
        
        darkening_factor = 0.7
        
        b, g, r =   color
        r = int(r * darkening_factor)
        g = int(g * darkening_factor)
        b = int(b * darkening_factor)
        outer_color =  (b, g, r)  #(0, 255, 0)   #(101, 124, 170)  #(255, 0, 0)   # Dark shade

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
    
    return output