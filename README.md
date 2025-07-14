
<img width="1200" height="350" alt="nutrivision" src="https://github.com/user-attachments/assets/5a2fc4cf-77c7-40f6-a74c-dc2a32b1b272" />

## Overview

A mobile application built with React Native that tracks North African dishes using an AI food detection model. This app solves the problem of limited nutritional tracking tools specifically designed for North African cuisine, helping users make informed dietary choices while preserving cultural food traditions.
<strong>This application solves several key Problems:</strong>
- Lack of nutritional databases for North African cuisine
- Difficulty tracking traditional dishes in Western health apps
- Language/cultural barriers in existing food tracking solutions
- Limited AI models trained on ethnic foods

### Supported Dishes/Foods

`Basbousa`, `Freekeh`, `Meshabek`, `Tcharek`, `Thieboudienne`, `Asidat Zgougou`,  
`Baghrir`, `Bradj`, `Brik`, `Cherchem`, `Couscous`, `Falafel`, `Fricasse`,  
`Ful Mdemmes`, `Kafteji`, `Karantika`, `Kunafah`, `Lablabi`, `Lham Lahlou`,  
`Maakouda`, `Mloukhia`, `Msamen`, `Tanjia` 

<div align='center'>
  
<img height="500" alt="nutrivision" src="https://github.com/user-attachments/assets/e2a4013a-0092-41c2-90f3-817fc6f4e2eb" />

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
| <img src="https://github.com/user-attachments/assets/54d73824-90d2-418b-bce0-d362b6090a39" width="250"/>  |<img src="https://github.com/user-attachments/assets/44b9eb23-32a8-4b03-b0a9-1e69b01b44f7" width="250"/> | <img src="https://github.com/user-attachments/assets/6e5d5991-4258-4a3c-b3f5-6e2c9e856f89" width="250"/>|
###  Core Functionality

| Home Screen | Camera Screen 1 | Camera Screen 2 |
|:-------------:|:---------------:|:---------------:|
| <img src="https://github.com/user-attachments/assets/7a9d5412-d423-4af8-8dbc-f7943325b16d" width="250"/> | <img src="https://github.com/user-attachments/assets/6e4aa401-e156-4be1-abd2-7a07de9471fd" width="250"/>|<img src="https://github.com/user-attachments/assets/818e3a40-2bfe-421f-a1bb-b47a0adafddd" width="250"/> |

###  Food Analysis


| Description Screen 1 | Description Screen 2 | Profile Screen|
|:--------------------:|:--------------------:|:----------------:|
| <img src="https://github.com/user-attachments/assets/1161bac1-bcdb-4015-a59a-35455467b82b" width="250"/>| <img src="https://github.com/user-attachments/assets/a0e22e2d-2f31-42e3-bd92-fc0c99fd5206" width="250"/> | <img src="https://github.com/user-attachments/assets/c9001621-ead6-411f-bb7d-0f4d7c70e421" width="250"/> | 


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
