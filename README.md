
![nutrivision](https://github.com/user-attachments/assets/e6d7a96f-ea0c-48eb-a8d2-179f9452da80)

## Overview

A mobile application built with React Native that tracks North African dishes using an AI food detection model. This app solves the problem of limited nutritional tracking tools specifically designed for North African cuisine, helping users make informed dietary choices while preserving cultural food traditions.
<strong>This application solves several key Problems:</strong>
- Lack of nutritional databases for North African cuisine
- Difficulty tracking traditional dishes in Western health apps
- Language/cultural barriers in existing food tracking solutions
- Limited AI models trained on ethnic foods

<div align='center'>
  
![0707(3) (1)](https://github.com/user-attachments/assets/38058bd1-26f2-46fb-9b22-1095f9bc8ede)

</div>

## Who Would Benefit from This Tool

- **Individuals with dietary restrictions** (diabetes, hypertension, etc.)
- **People wanting to maintain traditional North African diets** while monitoring nutrition
- **Health professionals** working with North African communities
- **Fitness enthusiasts** tracking macronutrient intake
- **Those with food allergies** to common North African ingredients
- **Tech-savvy home cooks** wanting nutritional insights
  
## Key Features

### Authentication Flow
- **Sign Up Screens**:
  - `SignUpScreen0.jsx`: Basic user information collection
  - `SignUpScreen1.jsx`: Health profile setup (age, weight, activity level)
  - `SignUpScreen2.jsx`: Health conditions and allergies selection
- **LoginScreen.jsx**: Secure authentication with remember me functionality
- **ResetPasswordScreen.jsx**: Password recovery flow

### Core Functionality
- **CameraScreen.jsx**: AI-powered food detection with:
  - Real-time object recognition
  - Nutritional information display
  - Health condition suitability analysis
- **FoodHistory.jsx**: Track daily food intake with:
  - Grouped history by date
  - Macronutrient breakdown
  - Detailed item view

### User Management
- **ProfileScreen.jsx**: User profile management with:
  - Personal information editing
  - Health condition tracking
  - Allergy management

##  Screenshots

###  Authentication

| Login Screen | Signup Screen 1 | Signup Screen 2 |
|:--------------:|:---------------:|:---------------:|
| <img src="https://github.com/user-attachments/assets/80bf76ea-6bab-48cd-9776-dc08457bec55" width="300"/>  |<img src="https://github.com/user-attachments/assets/de975279-ad86-4039-91f4-61526476ed2f" width="300"/> | <img src="https://github.com/user-attachments/assets/a264dfad-6a4b-4505-99e2-6efc68c54c86" width="300"/>|
###  Core Functionality

| Home Screen | Camera Screen 1 | Camera Screen 2 |
|:-------------:|:---------------:|:---------------:|
| <img src="https://github.com/user-attachments/assets/988e845e-a36a-4e99-85c8-381c62a1404d" width="300"/> | <img src="https://github.com/user-attachments/assets/a4ac5fe0-ad51-49a6-af65-1ef19f7780a6" width="300"/>|<img src="https://github.com/user-attachments/assets/8ee91314-5633-4714-9e05-0b48ef852978" width="300"/> |

###  Food Analysis

| Description Screen 1 | Description Screen 2 | Profile Screen|
|:--------------------:|:--------------------:|:----------------:|
| <img src="https://github.com/user-attachments/assets/29ddb604-f9d4-4e6d-b1b0-d52881c8949c" width="300"/>| <img src="https://github.com/user-attachments/assets/16f78657-4915-4220-a321-4be5baeab1b7" width="300"/> | <img src="https://github.com/user-attachments/assets/6bd45a25-1dd6-4e92-864d-c2a2439b47eb" width="300"/> | 


## Technologies Used


### Frontend
- React Native
- Expo Camera
- React Native Circular Chart

### Backend
- Node.js
- Express
- MongoDB

### AI/ML
- YOLOv11 (Object Detection)
- Roboflow (Model Deployment)

### Other Tools
- Axios (HTTP Client)
- ImageManipulator (Image Processing)
- Date-fns (Date Utilities)

## Technical Details

### AI Model
- **Framework**: YOLOv11
- **Training Platform**: Google Colab
- **Training Parameters**:
  - Epochs: 60
  - Learning Rate: 0.01
  - Batch Size: 16
- **Deployment**: Roboflow serverless API


## Installation

```bash
# Clone repository
git clone https://github.com/yourusername/north-african-food-tracker.git
cd north-african-food-tracker

# Install dependencies
npm install
# or
yarn install

# Set up environment variables
echo "API_KEY=your_roboflow_api_key" > .env
echo "BASE_URL=your_backend_api_url" >> .env

# Run the app
expo start![nutrivision](https://github.com/user-attachments/assets/d01773a3-f1af-451f-985f-2769e988fd8e)
