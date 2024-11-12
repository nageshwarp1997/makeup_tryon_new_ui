# -*- coding: utf-8 -*-
"""
Created on Thu Sep  5 17:28:13 2024

@author: Jayapriya
"""

import cv2
import numpy as np
 

def eyebrow_makeup(src: np.ndarray, eyebl_landmarks: np.ndarray,  eyebr_landmarks: np.ndarray,    color: list ):


      
     eyelmask = eyeb_mask(src, eyebl_landmarks,  color)  #[19, 0, 63]  [41, 5, 38]
 
     eyermask = eyeb_mask(src, eyebr_landmarks,  color )  #[19, 0, 63]  [41, 5, 38]
     
     non_zero_indicesel =np.where(eyelmask!= [0, 0, 0])  
     non_zero_indiceser =np.where(eyermask!= [0, 0, 0]) 

     if  len(non_zero_indicesel[0]) > 0 and len(non_zero_indiceser[0]) > 0 :
     
     
         alpha = 0.5  # Transparency factor
         output = cv2.addWeighted(src,1, eyelmask, alpha, 0)
         output = cv2.addWeighted(output,1, eyermask, alpha, 0)
     else:
         
         output = src
     
     return output
    
    
def eyeb_mask(src: np.ndarray, points: np.ndarray, color: list ):
    
    mask = np.zeros_like(src )  # Create a mask
    mask = cv2.fillPoly(mask , [points], color)  # Mask for the required facial feature
    return mask

 