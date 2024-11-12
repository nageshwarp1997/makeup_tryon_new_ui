import cv2
import numpy as np
from typing import List, Iterable
from mediapipe.python.solutions.face_mesh import FaceMesh

import random
def detect_landmarks(src: np.ndarray, is_stream: bool = False, minth=0.2):
    """
    Given an image `src` retrieves the facial landmarks associated with it
    """
    with FaceMesh(static_image_mode=not is_stream, max_num_faces=1,  refine_landmarks=True,   min_detection_confidence=minth) as face_mesh:
        results = face_mesh.process(cv2.cvtColor(src, cv2.COLOR_BGR2RGB))
    if results.multi_face_landmarks:
        return results.multi_face_landmarks[0].landmark
    return None

# 
def normalize_landmarks(landmarks, height: int, width: int, mask: Iterable = None):
    """
    The landmarks returned by mediapipe have coordinates between [0, 1].
    This function normalizes them in the range of the image dimensions so they can be played with.
    """
   
    normalized_landmarks = np.array([(int(landmark.x * width), int(landmark.y * height)) for landmark in landmarks])
 
    if mask:
        normalized_landmarks = normalized_landmarks[mask]
    return normalized_landmarks

def normalize_landmarksf(src, landmarks, height: int, width: int, mask: Iterable = None):
    """
    The landmarks returned by mediapipe have coordinates between [0, 1].
    This function normalizes them in the range of the image dimensions so they can be played with.
    """
    normalized_landmarks = np.array([(int(landmark.x * width), int(landmark.y * height)) for landmark in landmarks])
    ii =0
    pointsl = []
    print("===========================")
    for x, y in normalized_landmarks:
       
        pointsl.append([x,y])
    
    image_height, image_width = src.shape[0], src.shape[1]
    points = np.array(pointsl,dtype=np.int32)
      
     
     # Convert points to the correct format for convex hull calculation
    points = points.reshape(-1, 1, 2)
     
     # Compute the convex hull
    hull = cv2.convexHull(points)  
    hull=hull.reshape(hull.shape[0],2)
    
    #landmarks =hull
    normalized_landmarksf = hull #np.array([(int(landmark.x * width), int(landmark.y * height)) for landmark in landmarks])
    # print("===========================")
    # print(normalized_landmarks)
    # print("===========================")
    if mask:
        normalized_landmarks = normalized_landmarks[mask]
        normalized_landmarksf = np.concatenate((normalized_landmarks, normalized_landmarksf), axis=0)
    return normalized_landmarksf





def plot_landmarks(src: np.array, landmarks: List, show: bool = False):
    """
    Given a source image and a list of landmarks plots them onto the image
    """
    random.seed(42)

    # Generate 468 random colors
    random_colors = []
    for _ in range(8000):
        color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
        random_colors.append(color)
    dst = src.copy()
    ii =0
    pointsl = []
    print("===========================")
    for x, y in landmarks:
        cv2.circle(dst, (x, y), 2, random_colors[ii], cv2.FILLED)
        print('x='+str(x)+'y='+str(y)+'ii='+str(ii))
        pointsl.append([x,y])
        print(ii)
        #cv2.waitKey(500)
        ii=ii+1
    print("===========================")
        #print("Displaying image plotted with landmarks")
    #cv2.imshow("Plotted Landmarks", dst)
    
    
    
  
    
    # Example image dimensions
    image_height, image_width = src.shape[0], src.shape[1]
    points = np.array(pointsl,dtype=np.int32)
    # Example points (replace these with your actual points)
    # points = np.array([
    #     [50, 50], [150, 50], [200, 100], [250, 150], [200, 200], [150, 250], [50, 200]
    # ], dtype=np.int32)
    
    # Convert points to the correct format for convex hull calculation
    points = points.reshape(-1, 1, 2)
    
    # Compute the convex hull
    hull = cv2.convexHull(points)
    
    # Create a blank image for visualization
    image = np.zeros((image_height, image_width, 3), dtype=np.uint8)
    
    # Draw the convex hull
    cv2.polylines(image, [hull], isClosed=False, color=(0, 255, 0), thickness=2)
    
    # Draw the original points
    for (x, y) in points.squeeze():
        cv2.circle(image, (x, y), 5, (255, 0, 0), -1)
    
    # Display the image with the outer boundary
    cv2.imshow("Convex Hull", image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    return dst
