import cv2
import numpy as np
from landmarks import detect_landmarks, normalize_landmarks  
from typing import   Iterable
from lipsmakeup import *
from eyeshmakeup import *
from eyebrowsmakeup import * 


 
 
import random
random.seed(42)
 

             
             
upper_lip = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291,308, 415, 311, 312,13,82,81,80,191,78]
lower_lip = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324,318,402,317,14,87,178,88,95,78]         
          
face_conn = [10, 338, 297, 332, 284, 251, 389, 264, 447, 376, 433, 288, 367, 397, 365, 379, 378, 400, 377, 152,
             148, 176, 149, 150, 136, 172, 138, 213, 147, 234, 127, 162, 21, 54, 103, 67, 109,
             ]
  

 
left_eyeshadow_indices = [226, 247, 30, 29, 27, 28, 56, 190, 243, 173, 157, 158, 159, 160, 161, 246, 33, 130, 226],
right_eyeshadow_indices = [463, 414, 286, 258, 257, 259, 260, 467, 446, 359, 263, 466, 388, 387, 386, 385, 384, 398, 362, 463],
 

left_eyebrow_indices = [276, 283, 282,  295,  285, 300, 293, 334, 296, 336]
right_eyebrow_indices = [46, 53,52,65,70,63,105,66,107]
 
left_eyebrow_indices = [55, 107, 66, 105, 63, 70, 46, 53, 52, 65, 55]
right_eyebrow_indices = [285, 336, 296, 334, 293, 300, 276, 283, 295, 285]


    
def apply_eyeshadow(image, mask, color1, color2):
    gradient = np.linspace(color1, color2, num=mask.shape[0])
    for i in range(mask.shape[0]):
        image[mask[:, :, 0] == 255] = gradient[i]
    return image 

def apply_makeup(src: np.ndarray, is_stream: bool, feature: int, color: list     ):
    """
    Takes in a source image and applies effects onto it.
    """
    
  
    height, width, _ = src.shape
    points = None
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
                     points = normalize_landmarks(ret_landmarks, height, width, upper_lip  + lower_lip)   
                     upper_lip_points = normalize_landmarks(ret_landmarks, height, width, upper_lip)
                     lower_lip_points = normalize_landmarks(ret_landmarks, height, width, lower_lip)
                     output = lip_makeup(src , points ,upper_lip_points, lower_lip_points,  color  )
                    
                            
                else:
                    output = src
                    print("Lips are not detected or not visible.")

            elif feature == 2:   
                  
                      
                      
                      eyesl_landmarks = normalize_landmarks(ret_landmarks, height, width, left_eyeshadow_indices  ) 
                      eyesr_landmarks = normalize_landmarks(ret_landmarks, height, width, right_eyeshadow_indices  ) 
                      
                      if  not(eyesl_landmarks is None) and not(eyesr_landmarks is None):
                       
                          output = eyeshadow_makeup(src , eyesl_landmarks ,eyesr_landmarks ,  color  )
                          
                      else:
                          output = src
                          
                       
 
                   
            elif feature == 3:
                 
                 eyebl_landmarks = normalize_landmarks(ret_landmarks, height, width, left_eyebrow_indices  ) 
                 eyebr_landmarks = normalize_landmarks(ret_landmarks, height, width, right_eyebrow_indices  )         
                 if  not(eyebl_landmarks is None) and not(eyebr_landmarks is None):
                  
                     output = eyebrow_makeup(src , eyebl_landmarks ,eyebr_landmarks ,  color  )
                     
                 else:
                     output = src
                 
                 
                 
                 
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
    return output 



        




