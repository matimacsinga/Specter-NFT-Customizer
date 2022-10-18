import './App.css';
import React, { useState } from 'react'
import mergeImages from 'merge-images'
import { useNavigate } from "react-router-dom";
//@ts-ignore
import { userAddress } from './Auth.tsx';

//blank image to use when displaying variations that haven't been chosen yet
var blankImage = require('./blank_image.png')

//default image when accessing the selector page
var startingImage = require('./Default Image.PNG')

//quantum logo asset
var quantumLogo = require('./Recurso_3.png')

//final b64 image variable, traits object variable
let finalPFP, traits
//final png image variable
let finalPNG: File
//final json object of traits
let finalJSON: string
 
//helper used to take all images from a folder and map them by filename into an object
function assignImages(dict) {

  let images = {}
  dict.keys().map( (item, index) => (images[item.replace('./', '')] = dict(item)) )
  return images
}

function App() {

  let navigate = useNavigate()

  //objects that contain all images for the variations

  const faceShape = assignImages(require.context('../images/FaceShape', false, /\.(PNG)$/))

  const nose = assignImages(require.context('../images/Nose', false, /\.(PNG)$/ )) 

  const newEyes = assignImages(require.context('../images/Eyes', false, /\.(PNG)$/ ))

  const mouth = assignImages(require.context('../images/Mouth', false, /\.(PNG)$/ ))

  const eyebrows = assignImages(require.context('../images/Eyebrows', false, /\.(PNG)$/ ))

  const clothes = assignImages(require.context('../images/Clothes Final', false, /\.(PNG)$/ ))

  const background = assignImages(require.context('../images/Backgrounds', false, /\.(PNG)$/ ))

  const reflectionClothes = assignImages(require.context('../images/Final Clothes Reflection', false, /\.(PNG)$/ ))

  const hair = assignImages(require.context('../images/Hair', false, /\.(PNG)$/ ))

  const reflectionHair = assignImages(require.context('../images/Hair Reflection', false, /\.(PNG)$/ ))

  const backAccessories = assignImages(require.context('../images/Accessories Back', false, /\.(PNG)$/ ))

  const frontAccessories = assignImages(require.context('../images/Front Accessories', false, /\.(PNG)$/ ))

  const faceDetails = assignImages(require.context('../images/FaceDetails', false, /\.(PNG)$/ ))

  const headAccessories = assignImages(require.context('../images/Head Accessories', false, /\.(PNG)$/ ))

  const maskAccessories = assignImages(require.context('../images/Mask Accessories', false, /\.(PNG)$/ ))

  const noseUI = assignImages(require.context('../images/UI_Elements/Noses', false, /\.(PNG)$/ ))

  const eyesUI = assignImages(require.context('../images/UI_Elements/Eyes', false, /\.(PNG)$/ ))

  const eyebrowsUI = assignImages(require.context('../images/UI_Elements/Eyebrows', false, /\.(PNG)$/ ))

  const mouthUI = assignImages(require.context('../images/UI_Elements/Mouth', false, /\.(PNG)$/ ))

  const faceDetailsUI = assignImages(require.context('../images/UI_Elements/Face Details', false, /\.(PNG)$/ ))

  //variables that will hold the final random accessories after they passed through restrictions

  let finalBack: string

  let finalFront: string

  let finalFaceDetails: string

  let finalHead: string

  let finalMask: string

  //method that selects a random face details trait
  const randomFaceDetails = (gender) => {


    let i;
    let dict = faceDetails
    delete dict['blank_image.PNG']
    let genderArray: Array<string> = new Array<string>();

    for(i in dict){

      const arr = i.split("_");
      if(arr[1] === gender || arr[1] === 'Unisex')
        genderArray.push(i)
    }

    finalFaceDetails = genderArray[genderArray.length * Math.random() << 0]
    return
  }

  //method that selects either a random mask, random head accessory or blank, based on chance percentages
  const randomMaskHead = (gender) => {

    let whatToUse = weightedRandom({'Mask': 0.3, 'Head': 0.3, 'Blank': 0.4})

    if(whatToUse === 'Blank'){

      finalMask = 'blank_image.PNG'
      finalHead = 'blank_image.PNG'
      return
    }

    let i;
    let dict = (whatToUse === 'Mask') ? maskAccessories : headAccessories
    let genderArray: Array<string> = new Array<string>();

    for(i in dict){

      const arr = i.split("_");
      if(arr[1] === gender || arr[1] === 'Unisex')
        genderArray.push(i)
    }
  
    let final:string = genderArray[genderArray.length * Math.random() << 0]
    if(dict === maskAccessories){

      finalMask = final
      finalHead ='blank_image.PNG'
      return
    }
    else{

      finalHead = final
      finalMask ='blank_image.PNG'
      return  
    }  
  }

  //method that selects either a random front accessory, random back accessory or blank, based on chance percentages
  const randomFrontBack = (gender) => {

    let whatToUse = weightedRandom({'Front': 0.45, 'Back': 0.45, 'Blank': 0.1}) 

    if(whatToUse === 'Blank'){

      finalBack = 'blank_image.PNG'
      finalFront = 'blank_image.PNG'
      return
    }

    let i;
    let dict = (whatToUse === 'Front') ? frontAccessories : backAccessories
    let genderArray: Array<string> = new Array<string>();

    for(i in dict){

      const arr = i.split("_");
      if(arr[1] === gender || arr[1] === 'Unisex')
        genderArray.push(i)
    }
  
    let final:string = genderArray[genderArray.length * Math.random() << 0]
    if(dict === frontAccessories){

      finalFront = final
      finalBack ='blank_image.PNG'
      return
    }
    else{

      finalBack = final
      finalFront ='blank_image.PNG'
      return  
    }
  }

  //method that selects a random hair or clothes, based on what the user selected to be random
  const randomHairClothes = (dict, gender) => {
  
    let i, genderArray: Array<string> = new Array<string>();
    delete dict['random.PNG']
    if(dict === hair)
      delete dict['Hair_Man_Bald_000000'] 

    for(i in dict){

        const arr = i.split("_");
        if(arr[1] === gender || arr[1] === 'Unisex')
          genderArray.push(i)
    }
    
    return genderArray[genderArray.length * Math.random() << 0]
  }
 
  //method that select the appropriate hair reflection based on the background color and current hair
  const reflection = (background: string, traitUsed: string, varString: string) => {

    let backgroundColor: string, traitString: string 

    const backgroundParts = background.split("_");

    const backgroundColorParts = backgroundParts[3].split(".");

    backgroundColor = backgroundColorParts[0]

    const traitParts = traitUsed.split("_");

    traitString = traitParts[1] + '_' + traitParts[2]

    return varString+'Reflection_'+traitString+'_'+backgroundColor+'.PNG'
  }

  function urltoFile(url, filename, mimeType){
    mimeType = mimeType || (url.match(/^data:([^;]+);/)||'')[1];
    return (fetch(url)
      .then(function(res){return res.arrayBuffer();})
      .then(function(buf){return new File([buf], filename, {type:mimeType});})
    );
  }

  //method that generates the picture and traits once everything has been chosen
  const create = async () => {

    //check if user respected non-mandatory rules 
    if( ( (hairRandom === true) && (clothesRandom === true) ) || ( (hairRandom === false && hairIsBlank === false) && (clothesRandom === false && clothesIsBlank === false) ) ){

      alert("Either Hair or Clothes have to be random")
    }

    else {

      //assign values to trait variables

      let finalClothes = (!clothesVariation) ? randomHairClothes(clothes, faceShapeGenderVariable) : 'Clothes_'+clothesGenderVariable+'_'+clothesVariation+'_'+clothesColor+'.PNG'

      let finalHair = (!hairVariation) ? randomHairClothes(hair, faceShapeGenderVariable) : 'Hair_'+hairGenderVariable+'_'+hairVariation+'_'+hairColor+'.PNG'

      let finalBackground = randomVariation(background, true)

      let finalClothesReflection = reflection(finalBackground, finalClothes, 'Clothes')

      let finalHairReflection = reflection(finalBackground, finalHair, 'Hair')

      randomFrontBack(faceShapeGenderVariable)

      randomFaceDetails(faceShapeGenderVariable)

      randomMaskHead(faceShapeGenderVariable)

      //contains all of the restrictions that some accessories might have

      let specificationDict = 
      {
        'Mouth_Unisex_Cigar_000000.PNG': ['Masks_Unisex_PinkTransparent.PNG', 'Masks_Unisex_PurpleTech.PNG','HeadAccessories_Unisex_Transparent.PNG',
                                          'HeadAccessories_Unisex_GasMask_000000.PNG', 'HeadAccessories_Unisex_GasMask_5E1462.PNG', 
                                          'HeadAccessories_Unisex_GasMask_141462.PNG','HeadAccessories_Unisex_SmokeMask_374D31.PNG',
                                          'HeadAccessories_Unisex_SmokeMask_3941AD.PNG','HeadAccessories_Unisex_SmokeMask_572361.PNG',
                                          'HeadAccessories_Unisex_SmokeMask_C4512C.PNG','Masks_Unisex_CyberQuantum.PNG',
                                          'Masks_Unisex_Monocle.PNG','HeadAccessories_Unisex_PurpleTransparent.PNG',
                                          'HeadAccessories_Unisex_TransparentGlasses_B6D1FF.PNG','HeadAccessories_Unisex_TransparentGlasses_E5F6FF.PNG',
                                          'HeadAccessories_Unisex_TransparentGlasses_FDAEFF.PNG','HeadAccessories_Unisex_VideoMask.PNG',
                                          'Masks_Unisex_EyePatch.PNG'],

        'HeadAccessories_Unisex_TransparentGlasses_B6D1FF.PNG': ['Hair_Man_Bandana_5D3C2F.PNG','Hair_Man_Bandana_797979.PNG','Hair_Man_Bandana_D7A776.PNG',
        'Hair_Man_ShortDreadlocks_2C41E1.PNG','Hair_Man_ShortDreadlocks_015100.PNG','Hair_Man_ShortDreadlocks_831633.PNG','Hair_Man_ShortDreadlocks_EB03F0.PNG',
        'Hair_Unisex_Short_103E5B.PNG','Hair_Unisex_Short_015100.PNG','Hair_Unisex_Short_40291A.PNG','Hair_Woman_Braid_536FFF.PNG',
        'Hair_Woman_Braid_862E31.PNG', 'Hair_Woman_Braid_FFFFFF.PNG', 'Hair_Woman_Bun_8E6647.PNG', 'Hair_Woman_Bun_C2700E.PNG', 'Hair_Woman_Bun_F27231.PNG',
        'Hair_Woman_Fringe_0B4283.PNG','Hair_Woman_Fringe_5E1462.PNG','Hair_Woman_Fringe_64210E.PNG','Hair_Woman_Fringe_215111.PNG','Hair_Woman_Fringe_DBDBDB.PNG'],

        'HeadAccessories_Unisex_TransparentGlasses_E5F6FF.PNG': ['Hair_Man_Bandana_5D3C2F.PNG','Hair_Man_Bandana_797979.PNG','Hair_Man_Bandana_D7A776.PNG',
        'Hair_Man_ShortDreadlocks_2C41E1.PNG','Hair_Man_ShortDreadlocks_015100.PNG','Hair_Man_ShortDreadlocks_831633.PNG','Hair_Man_ShortDreadlocks_EB03F0.PNG',
        'Hair_Unisex_Short_103E5B.PNG','Hair_Unisex_Short_015100.PNG','Hair_Unisex_Short_40291A.PNG','Hair_Woman_Braid_536FFF.PNG',
        'Hair_Woman_Braid_862E31.PNG', 'Hair_Woman_Braid_FFFFFF.PNG', 'Hair_Woman_Bun_8E6647.PNG', 'Hair_Woman_Bun_C2700E.PNG', 'Hair_Woman_Bun_F27231.PNG',
        'Hair_Woman_Fringe_0B4283.PNG','Hair_Woman_Fringe_5E1462.PNG','Hair_Woman_Fringe_64210E.PNG','Hair_Woman_Fringe_215111.PNG','Hair_Woman_Fringe_DBDBDB.PNG'],

        'HeadAccessories_Unisex_TransparentGlasses_FDAEFF.PNG': ['Hair_Man_Bandana_5D3C2F.PNG','Hair_Man_Bandana_797979.PNG','Hair_Man_Bandana_D7A776.PNG',
        'Hair_Man_ShortDreadlocks_2C41E1.PNG','Hair_Man_ShortDreadlocks_015100.PNG','Hair_Man_ShortDreadlocks_831633.PNG','Hair_Man_ShortDreadlocks_EB03F0.PNG',
        'Hair_Unisex_Short_103E5B.PNG','Hair_Unisex_Short_015100.PNG','Hair_Unisex_Short_40291A.PNG','Hair_Woman_Braid_536FFF.PNG',
        'Hair_Woman_Braid_862E31.PNG', 'Hair_Woman_Braid_FFFFFF.PNG', 'Hair_Woman_Bun_8E6647.PNG', 'Hair_Woman_Bun_C2700E.PNG', 'Hair_Woman_Bun_F27231.PNG',
        'Hair_Woman_Fringe_0B4283.PNG','Hair_Woman_Fringe_5E1462.PNG','Hair_Woman_Fringe_64210E.PNG','Hair_Woman_Fringe_215111.PNG','Hair_Woman_Fringe_DBDBDB.PNG'],

        'Clothes_Unisex_AstroJacket_E3BE8A.PNG': ['FrontAccessories_Unisex_PartyGlassHand.PNG','FrontAccessories_Unisex_RoboticHand.PNG','FrontAccessories_Unisex_SprayHand.PNG'],

        'Clothes_Unisex_AstroJacket_E5E645.PNG': ['FrontAccessories_Unisex_PartyGlassHand.PNG','FrontAccessories_Unisex_RoboticHand.PNG','FrontAccessories_Unisex_SprayHand.PNG']
      }

      //in case the current accessories have restrictions, it randomly selects and checks again for another set of accessories until they are valid

      let ok = false
 
      do{

        if( ('Mouth_'+mouthGenderVariable+'_'+mouthVariation+'_'+mouthColor+'.PNG' in specificationDict && specificationDict['Mouth_'+mouthGenderVariable+'_'+mouthVariation+'_'+mouthColor+'.PNG'].indexOf(finalMask) > -1) || 
            ('Mouth_'+mouthGenderVariable+'_'+mouthVariation+'_'+mouthColor+'.PNG' in specificationDict && specificationDict['Mouth_'+mouthGenderVariable+'_'+mouthVariation+'_'+mouthColor+'.PNG'].indexOf(finalHead) > -1) ||
            (finalHead in specificationDict && specificationDict[finalHead].indexOf(finalHair) > -1) ||
            (finalClothes in specificationDict && specificationDict[finalClothes].indexOf(finalFront) > -1) ||
            ((finalHead === 'HeadAccessories_Unisex_BubbleGum_6BDE98.PNG' || finalHead === 'HeadAccessories_Unisex_BubbleGum_94ACF2.PNG' || 
            finalHead === 'HeadAccessories_Unisex_BubbleGum_EE89C0.PNG') && (mouthVariation !== 'BubbleGum')) ){

              randomFrontBack(faceShapeGenderVariable)

              randomFaceDetails(faceShapeGenderVariable)

              randomMaskHead(faceShapeGenderVariable)
              
            }
        else{

          ok = true
          break;  
        }
      }
      while(ok === false)

      //checks if user has selected everything and if so, merges the images together to create the b64 final image and assigns it
      if( (hairRandom === false && hairIsBlank === true) || (clothesRandom === false && clothesIsBlank === true) || faceIsBlank || eyesIsBlank || noseIsBlank || eyebrowsIsBlank || mouthIsBlank || mouthGenderVariable === null || eyesGenderVariable === null || faceShapeVariation === null || eyesVariation === null || noseVariation === null || eyebrowsVariation === null || mouthVariation === null)
        alert('You need to select all Mandatory Traits')
      else{

        await mergeImages([background[finalBackground], backAccessories[finalBack], faceShape['FaceShape_'+faceShapeGenderVariable+'_'+faceShapeVariation+'.PNG'], 
                    faceDetails[finalFaceDetails], newEyes['Eyes_'+eyesGenderVariable+'_'+eyesVariation+'_'+eyesColor+'.PNG'], 
                    eyebrows['Eyebrows_Unisex_'+eyebrowsVariation+'_'+eyebrowsColor+'.PNG'], nose['Nose_'+noseVariation+'.PNG'], 
                    mouth['Mouth_'+mouthGenderVariable+'_'+mouthVariation+'_'+mouthColor+'.PNG'], maskAccessories[finalMask], 
                    clothes[finalClothes], reflectionClothes[finalClothesReflection], hair[finalHair], reflectionHair[finalHairReflection], 
                    headAccessories[finalHead], frontAccessories[finalFront]])
        .then(b64 => finalPFP = b64)

        let backgroundVariationMeta = finalBackground.split('_')[2]
        let backgroundColorMeta = finalBackground.split('_')[3].split('.')[0]

        let faceDetailsMeta = finalFaceDetails.split('_')[2].split('.')[0]

        let backAccessoriesVariationMeta
        let backAccessoriesColorMeta

        let frontAccessoriesVariationMeta
        let frontAccessoriesColorMeta

        if(finalBack === "blank_image.PNG" && finalFront === "blank_image.PNG"){

          frontAccessoriesVariationMeta = ''
          frontAccessoriesColorMeta = ''

          backAccessoriesVariationMeta = ''
          backAccessoriesColorMeta = ''
          
        }
        else{

          if(finalBack !== "blank_image.PNG"){

            backAccessoriesVariationMeta = finalBack.split('_')[2]
            backAccessoriesColorMeta = finalBack.split('_')[3].split('.')[0]
    
            frontAccessoriesVariationMeta = ''
            frontAccessoriesColorMeta = ''
          }
          else{

            backAccessoriesVariationMeta = ''
            backAccessoriesColorMeta = ''

            frontAccessoriesVariationMeta = finalFront.split('_')[2]
            frontAccessoriesColorMeta = finalFront.split('_')[3].split('.')[0] 
          }
        }

        let maskMeta

        let headVariationMeta
        let headColorMeta

        if(finalMask === "blank_image.PNG" && finalHead === "blank_image.PNG"){

          maskMeta = ''

          headVariationMeta = ''
          headColorMeta = ''
        }
        else{

          if(finalMask !== "blank_image.PNG"){

            maskMeta = finalMask.split('_')[2]

            headVariationMeta = ''
            headColorMeta = ''
          }
          else{

            maskMeta = ''  

            headVariationMeta = finalHead.split('_')[2]
            headColorMeta = finalHead.split('_')[3].split('.')[0]   
          }
        }

        let genderMeta = faceShapeGenderVariable

        let faceShapeVariationMeta = faceShapeVariation
        
        let eyesVariationMeta = eyesVariation
        let eyesColorMeta = eyesColor

        let eyebrowsVariationMeta = eyebrowsVariation
        let eyebrowsColorMeta = eyebrowsColor

        let noseVariationMeta: number = noseVariation

        let mouthVariationMeta = mouthVariation

        let clothesVariationMeta = finalClothes.split('_')[2]
        let clothesColorMeta = finalClothes.split('_')[3].split('.')[0] 

        let hairVariationMeta = finalHair.split('_')[2]
        let hairColorMeta = finalHair.split('_')[3].split('.')[0] 

        traits = {'traits': {'gender': genderMeta,'face': faceShapeVariationMeta, 'eyes': eyesVariationMeta, 'eyes-color': eyesColorMeta, 'eyebrows': eyebrowsVariationMeta,
                      'eyebrows-color': eyebrowsColorMeta, 'nose': noseVariationMeta.toString(), 'mouth': mouthVariationMeta, 'clothes': clothesVariationMeta,
                      'clothes-color': clothesColorMeta, 'hair': hairVariationMeta, 'hair-color': hairColorMeta, 'background': backgroundVariationMeta,
                      'background-color': backgroundColorMeta, 'face-details': faceDetailsMeta, 'back-accessories': backAccessoriesVariationMeta,
                      'back-accessories-color': backAccessoriesColorMeta, 'front-accessories': frontAccessoriesVariationMeta,
                      'front-accessories-color': frontAccessoriesColorMeta, 'mask': maskMeta, 'head-accessories': headVariationMeta,
                      'head-accessories-color': headColorMeta},
                      'image': finalPFP}
        
        //function to create PNG from image
        urltoFile(finalPFP, userAddress+'.png','')
        .then(function(file){
            finalPNG = file
        })

        console.log(traits)

        //creating json object
        finalJSON = JSON.stringify(traits)

        navigate('/end')
      }
    }
    
  }

  //random based on chance percentages
  const weightedRandom = (dict) => {

    let i, sum = 0, r = Math.random()
    for(i in dict){
  
      sum += dict[i]
      if(r <= sum)
        return i
    }
  }

  //changes the face shape when selecting the trait
  const changeFaceShape = (featureVariation, featureFunction, blankVariableFunction, genderString, variationName) => {
    
    if(genderString === 'Man'){

      setManDisabled(false)
      setWomanDisabled(true)
    }

    if(genderString === 'Woman'){

      setManDisabled(true)
      setWomanDisabled(false)
    }

    let colorButtons = document.getElementsByClassName(variationName+'_color_buttons');

    if(previousButtons !== null){

      for(let color of previousButtons){

        (color as HTMLInputElement).style.display = 'none'
      }    
    }

    for(let color of colorButtons){

      (color as HTMLInputElement).style.display = 'inline-block'
    }

    setPreviousButtons(colorButtons)

    
    setFaceShapeGenderVariable(genderString)
    setEyesGenderVariable(genderString)
    setMouthGenderVariable(genderString)
    setClothesGenderVariable(genderString)
    setHairGenderVariable(genderString)
    blankVariableFunction(false)
    if(genderString !== eyesGenderVariable && genderString !== mouthGenderVariable && genderString !== mouthGenderVariable 
      && genderString !== hairGenderVariable){
      setEyesIsBlank(true)
      setMouthIsBlank(true)
      setEyebrowsIsBlank(true)
      setMouthIsBlank(true)
      setNoseIsBlank(true)
      setHairIsBlank(true)
      setClothesIsBlank(true)
    }
    featureFunction(featureVariation)
  }

  let empty: HTMLCollectionOf<Element> = document.getElementsByClassName('nothing')

  //manages the color buttons for each trait that has them
  const [previousButtons, setPreviousButtons] = useState(empty)

  //select a variation of a trait that takes gender into account
  const changeVariationWithGender = (featureVariation, featureFunction, blankVariableFunction, genderString, variationName, genderFunction, colorFunction, colorString) => {
    
    let colorButtons = document.getElementsByClassName(variationName+'_color_buttons');

    if(previousButtons !== null){

      for(let color of previousButtons){

        (color as HTMLInputElement).style.display = 'none'
      }    
    }

    for(let color of colorButtons){

      (color as HTMLInputElement).style.display = 'inline-block'
    }

    setPreviousButtons(colorButtons)

    genderFunction(genderString)
    blankVariableFunction(false)
    featureFunction(featureVariation)
    colorFunction(colorString)
  }

  //select variation of trait that does not take color into account
  const changeVariationNoColor = (featureVariation, featureFunction, blankVariableFunction, variationName) => {

    let colorButtons = document.getElementsByClassName(variationName+'_color_buttons');

    if(previousButtons !== null){

      for(let color of previousButtons){

        (color as HTMLInputElement).style.display = 'none'
      }    
    }

    for(let color of colorButtons){

      (color as HTMLInputElement).style.display = 'inline-block'
    }

    blankVariableFunction(false)
    featureFunction(featureVariation)     
  }

  //sekect variation that doesn't take gender into account
  const changeVariation = (featureVariation, featureFunction, blankVariableFunction, variationName, colorFunction, colorString) => {

    let colorButtons = document.getElementsByClassName(variationName+'_color_buttons');

    if(previousButtons !== null){

      for(let color of previousButtons){

        (color as HTMLInputElement).style.display = 'none'
      }    
    }

    for(let color of colorButtons){

      (color as HTMLInputElement).style.display = 'inline-block'
    }

    setPreviousButtons(colorButtons)
    
    blankVariableFunction(false)
    featureFunction(featureVariation)
    colorFunction(colorString)
  }

  //select variation of trait that can be random and has color
  const changeRandomVariationWithColor = (featureVariation, featureFunction, blankVariableFunction, randomVariableFunction, genderFunction, genderString, variationName, colorFunction, colorString) => {

    let colorButtons = document.getElementsByClassName(variationName+'_color_buttons');

    if(previousButtons !== null){

      for(let color of previousButtons){

        (color as HTMLInputElement).style.display = 'none'
      }    
    }

    for(let color of colorButtons){

      (color as HTMLInputElement).style.display = 'inline-block'
    }

    setPreviousButtons(colorButtons)

    genderFunction(genderString)
    randomVariableFunction(false)
    blankVariableFunction(false)
    featureFunction(featureVariation) 
    colorFunction(colorString) 
  }

  //helps with displaying a blank image if a trait is not selected yet

  const [faceIsBlank, setFaceIsBlank] = useState(true)

  const [eyesIsBlank, setEyesIsBlank] = useState(true)

  const [noseIsBlank, setNoseIsBlank] = useState(true)

  const [mouthIsBlank, setMouthIsBlank] = useState(true)

  const [eyebrowsIsBlank, setEyebrowsIsBlank] = useState(true)

  const [clothesIsBlank, setClothesIsBlank] = useState(true)
 
  const [hairIsBlank, setHairIsBlank] = useState(true)

  //takes into account the gender of certain traits

  const [eyesGenderVariable, setEyesGenderVariable] = useState(null)

  const [faceShapeGenderVariable, setFaceShapeGenderVariable] = useState(null)

  const [mouthGenderVariable, setMouthGenderVariable] = useState(null)

  const [clothesGenderVariable, setClothesGenderVariable] = useState(null)

  const [hairGenderVariable, setHairGenderVariable] = useState(null)

  const [faceShapeVariation, setFaceShapeVariation] = useState('')

  const [eyesVariation, setEyesVariation] = useState(null)

  const [noseVariation, setNoseVariation] = useState(null)

  const [mouthVariation, setMouthVariation] = useState(null)

  const [eyebrowsVariation, setEyebrowsVariation] = useState(null)

  const [clothesVariation, setClothesVariation] = useState(null)

  const [hairVariation, setHairVariation] = useState(null)

  //takes into account the color of certain traits

  const [eyesColor, setEyesColor] = useState('ACACAC')

  const [eyebrowsColor, setEyebrowsColor] = useState('000000')

  const [mouthColor, setMouthColor] = useState('Blank')

  const [hairColor, setHairColor] = useState('Blank')

  const [clothesColor, setClothesColor] = useState('Blank')

  const [clothesRandom, setClothesRandom] = useState(false)

  const [hairRandom, setHairRandom] = useState(false)


  const [manDisabled, setManDisabled] = useState(false)

  const [womanDisabled, setWomanDisabled] = useState(false)

  //manages the selection when users selects a non-mandatory trait as random  

  const selectRandom = (randomFunction, blankFunction, variationFunction) => {

    randomFunction(true)
    blankFunction(true)
    variationFunction(null)
  }

  //used to select a random background
  const randomVariation = (dict, isAlwaysRandom) => {

    var keys = Object.keys(dict)
    if(!isAlwaysRandom)
      keys.pop()
    return keys[keys.length * Math.random() << 0]
  }

  return (
    <div className="App">
      <header className="App-header">   
            <img id='logo_image' src={quantumLogo} alt='logo'/>
            <h5 id='select_text_0'>CREATE YOUR AVATAR</h5>
            <p id='select_paragraph_0'>Through this page, you will be able to choose some features to customize your PFP avatar</p>
            <img id = 'defaultImage' className='defaultImage' src={(faceIsBlank && eyesIsBlank && eyebrowsIsBlank && clothesIsBlank && hairIsBlank && noseIsBlank && mouthIsBlank) ? startingImage : blankImage} alt='starting'/>
            <img id = 'faceImage' className='faceImage' src={ (faceIsBlank || faceShapeGenderVariable === null || faceShapeVariation === null ) ? blankImage : faceShape['FaceShape_'+faceShapeGenderVariable+'_'+faceShapeVariation+'.PNG']} alt='face' />
            <img id = 'eyesImage' className='overImage' src={ (eyesIsBlank || eyesGenderVariable === null || eyesVariation === null ) ? blankImage : newEyes['Eyes_'+eyesGenderVariable+'_'+eyesVariation+'_'+eyesColor+'.PNG']} alt='eyes' />
            <img id = 'eyebrowsImage' className='overImage' src={ (eyebrowsIsBlank || eyebrowsVariation === null ) ? blankImage : eyebrows['Eyebrows_Unisex_'+eyebrowsVariation+'_'+eyebrowsColor+'.PNG']} alt='eyebrows' />
            <img id = 'noseImage' className='overImage' src={ (noseIsBlank || noseVariation === null ) ? blankImage : nose['Nose_'+noseVariation+'.PNG']} alt='nose' />
            <img id = 'mouthImage' className='overImage' src={ (mouthIsBlank || mouthVariation === null || mouthGenderVariable === null ) ? blankImage : mouth['Mouth_'+mouthGenderVariable+'_'+mouthVariation+'_'+mouthColor+'.PNG']} alt='mouth' />
            <img id = 'clothesImage' className='overImage' src={ (clothesIsBlank || clothesVariation === null || clothesGenderVariable === null) ? blankImage : clothes['Clothes_'+clothesGenderVariable+'_'+clothesVariation+'_'+clothesColor+'.PNG']} alt='clothes' />
            <img id = 'hairImage' className='overImage' src={ (hairIsBlank || hairVariation === null || hairGenderVariable === null) ? blankImage : hair['Hair_'+hairGenderVariable+'_'+hairVariation+'_'+hairColor+'.PNG']} alt='hair' />
          <div id = 'buttons_overlay'>
            <h5 id='select_text'>Mandatory Traits</h5>
            <p id='select_paragraph'>Choose one trait from each category</p>
            <h6 id='under_mandatory'>Face Shape</h6>
            <div id='male_buttons_div' className='face_buttons_div'>
              <input id='male_face_button' onClick={() => changeFaceShape('Light',setFaceShapeVariation, setFaceIsBlank, 'Man', 'faceshape')} type='image' src={faceShape['FaceShape_Man_Light.PNG']} className='face_buttons' alt='bruh'></input>
              <input id='female_face_button' onClick={() => changeFaceShape('Light',setFaceShapeVariation, setFaceIsBlank, 'Woman', 'faceshape')} type='image' src={faceShape['FaceShape_Woman_Light.PNG']} className='face_buttons' alt='bruh'></input>
            </div> 
            <h6 className='button_descriptor'>Eyes</h6>
            <div id='neweyes_buttons_div' className='face_buttons_div'>       
              <input onClick={() => changeVariationWithGender('Bored', setEyesVariation, setEyesIsBlank, 'Man', 'neweyes', setEyesGenderVariable, setEyesColor, 'ACACAC')} disabled = {manDisabled} type='image' src={eyesUI['IMG_2483.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationWithGender('Friendly', setEyesVariation, setEyesIsBlank, 'Man', 'neweyes', setEyesGenderVariable, setEyesColor, 'ACACAC' )} disabled = {manDisabled} type='image' src={eyesUI['IMG_2484.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationWithGender('Sexy', setEyesVariation, setEyesIsBlank, 'Man', 'neweyes', setEyesGenderVariable, setEyesColor, 'ACACAC')} disabled = {manDisabled} type='image' src={eyesUI['IMG_2485.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationWithGender('Mora', setEyesVariation, setEyesIsBlank, 'Man', 'neweyes', setEyesGenderVariable, setEyesColor, 'ACACAC')} disabled = {manDisabled} type='image' src={eyesUI['Man Mora.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationWithGender('Line', setEyesVariation, setEyesIsBlank, 'Man', 'neweyes', setEyesGenderVariable, setEyesColor, 'ACACAC')} disabled = {manDisabled} type='image' src={eyesUI['Man Line.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationWithGender('Bored', setEyesVariation, setEyesIsBlank, 'Woman', 'neweyes', setEyesGenderVariable, setEyesColor, 'ACACAC')} disabled = {womanDisabled} type='image' src={eyesUI['IMG_2488.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationWithGender('Friendly', setEyesVariation, setEyesIsBlank, 'Woman', 'neweyes', setEyesGenderVariable, setEyesColor, 'ACACAC')} disabled = {womanDisabled} type='image' src={eyesUI['IMG_2489.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationWithGender('Sexy', setEyesVariation, setEyesIsBlank, 'Woman', 'neweyes', setEyesGenderVariable, setEyesColor, 'ACACAC')} disabled = {womanDisabled} type='image' src={eyesUI['IMG_2490.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationWithGender('Mora', setEyesVariation, setEyesIsBlank, 'Woman', 'neweyes', setEyesGenderVariable, setEyesColor, 'ACACAC')} disabled = {womanDisabled} type='image' src={eyesUI['Woman Mora.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationWithGender('Line', setEyesVariation, setEyesIsBlank, 'Woman', 'neweyes', setEyesGenderVariable, setEyesColor, 'ACACAC')} disabled = {womanDisabled} type='image' src={eyesUI['Woman Line.PNG']} className='face_buttons' alt='bruh'></input>
            </div> 
            <h6 className='button_descriptor'>Eyebrows</h6>
            <div id='eyebrows_buttons_div' className='face_buttons_div'>       
              <input onClick={() => changeVariation('Long', setEyebrowsVariation, setEyebrowsIsBlank, 'eyebrows', setEyebrowsColor, 'D4D0CF')} type='image' src={eyebrowsUI['IMG_2501.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariation('Medium', setEyebrowsVariation, setEyebrowsIsBlank, 'eyebrows', setEyebrowsColor, 'D4D0CF')} type='image' src={eyebrowsUI['IMG_2502.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariation('Thick', setEyebrowsVariation, setEyebrowsIsBlank, 'eyebrows', setEyebrowsColor, 'D4D0CF')} type='image' src={eyebrowsUI['IMG_2503.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariation('Thin', setEyebrowsVariation, setEyebrowsIsBlank, 'eyebrows', setEyebrowsColor, 'D4D0CF')} type='image' src={eyebrowsUI['IMG_2504.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariation('Zebra', setEyebrowsVariation, setEyebrowsIsBlank, 'eyebrows', setEyebrowsColor, 'D4D0CF')} type='image' src={eyebrowsUI['IMG_2505.PNG']} className='face_buttons' alt='bruh'></input>
            </div>
            <h6 className='button_descriptor'>Nose</h6>
            <div id='nose_buttons_div' className='face_buttons_div'>
              <input onClick={() => changeVariationNoColor(1, setNoseVariation, setNoseIsBlank, '')} type='image' src={noseUI['IMG_1740.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationNoColor(2, setNoseVariation, setNoseIsBlank, '')} type='image' src={noseUI['IMG_1739.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationNoColor(3, setNoseVariation, setNoseIsBlank, '')} type='image' src={noseUI['IMG_1741.PNG']} className='face_buttons' alt='bruh'></input>
            </div>
            <h6 className='button_descriptor'>Mouth</h6> 
            <div id='mouth_buttons_div' className='face_buttons_div'>  
              <input onClick={() => changeVariationWithGender('Cigar', setMouthVariation, setMouthIsBlank, 'Unisex', 'mouth', setMouthGenderVariable, setMouthColor, '000000')} type='image' src={mouthUI['IMG_2473.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationWithGender('Surprised', setMouthVariation, setMouthIsBlank, 'Man', 'womanmouth', setMouthGenderVariable, setMouthColor, 'BC8858')} type='image' disabled = {manDisabled} src={mouthUI['Man Surprised Mouth.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationWithGender('Classic', setMouthVariation, setMouthIsBlank, 'Man', 'mouth', setMouthGenderVariable, setMouthColor, '')} disabled = {manDisabled} type='image' src={mouthUI['IMG_2469.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationWithGender('Friendly', setMouthVariation, setMouthIsBlank, 'Man', 'mouth', setMouthGenderVariable, setMouthColor, '')} disabled = {manDisabled} type='image' src={mouthUI['IMG_2470.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationWithGender('Grin', setMouthVariation, setMouthIsBlank, 'Man', 'mouth', setMouthGenderVariable, setMouthColor, '')} disabled = {manDisabled} type='image' src={mouthUI['IMG_2471.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationWithGender('Serious', setMouthVariation, setMouthIsBlank, 'Unisex', 'mouth', setMouthGenderVariable, setMouthColor, '')} type='image' src={mouthUI['IMG_2472.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationWithGender('Stern', setMouthVariation, setMouthIsBlank, 'Unisex', 'mouth', setMouthGenderVariable, setMouthColor, '000000')} type='image' src={mouthUI['IMG_2474.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationWithGender('Classic', setMouthVariation, setMouthIsBlank, 'Woman', 'womanmouth', setMouthGenderVariable, setMouthColor, '845830')} disabled = {womanDisabled} type='image' src={mouthUI['IMG_2475.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeVariationWithGender('Surprised', setMouthVariation, setMouthIsBlank, 'Woman', 'womanmouth', setMouthGenderVariable, setMouthColor, '845830')} disabled = {womanDisabled} type='image' src={mouthUI['IMG_2476.PNG']} className='face_buttons' alt='bruh'></input>
            </div>
            <div id = "non_mandatory_div">
              <h5 id='select_text_2'>Non-Mandatory Traits</h5>
              <p id='select_paragraph_2'>Choose one trait, the other one will be random</p>
            </div>
            <h6 id='under_mandatory'>Clothes</h6>
            <div id='clothes_buttons_div' className='face_buttons_div'>
              <input onClick={() => selectRandom(setClothesRandom, setClothesIsBlank, setClothesVariation)} type='image' src={clothes['random.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeRandomVariationWithColor('FormalSuit', setClothesVariation, setClothesIsBlank, setClothesRandom, setClothesGenderVariable, 'Unisex', 'formalsuit', setClothesColor, '1A1A1A')} type='image' src={clothes['Clothes_Unisex_FormalSuit_1A1A1A.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeRandomVariationWithColor('Wrap', setClothesVariation, setClothesIsBlank, setClothesRandom, setClothesGenderVariable, 'Unisex', 'wrap', setClothesColor, 'F46524')} type='image' src={clothes['Clothes_Unisex_Wrap_F46524.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeRandomVariationWithColor('AstroJacket', setClothesVariation, setClothesIsBlank, setClothesRandom, setClothesGenderVariable, 'Unisex', 'astrojacket', setClothesColor, 'E3BE8A')} type='image' src={clothes['Clothes_Unisex_AstroJacket_E3BE8A.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeRandomVariationWithColor('MetalJacket', setClothesVariation, setClothesIsBlank, setClothesRandom, setClothesGenderVariable, 'Unisex', '', setClothesColor, '222232')} type='image' src={clothes['Clothes_Unisex_MetalJacket_222232.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeRandomVariationWithColor('TechJacket', setClothesVariation, setClothesIsBlank, setClothesRandom, setClothesGenderVariable, 'Unisex', 'techjacket',setClothesColor,'4348A0')} type='image' src={clothes['Clothes_Unisex_TechJacket_4348A0.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeRandomVariationWithColor('CamoVest', setClothesVariation, setClothesIsBlank, setClothesRandom, setClothesGenderVariable, 'Unisex', 'camovest',setClothesColor,'648200')} type='image' src={clothes['Clothes_Unisex_CamoVest_648200.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeRandomVariationWithColor('ChunoJacket', setClothesVariation, setClothesIsBlank, setClothesRandom, setClothesGenderVariable, 'Unisex', 'chunojacket', setClothesColor, '0F3817')} type='image' src={clothes['Clothes_Unisex_ChunoJacket_0F3817.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeRandomVariationWithColor('SpySuit', setClothesVariation, setClothesIsBlank, setClothesRandom, setClothesGenderVariable, 'Unisex', 'spysuit', setClothesColor, '3C3C3C')} type='image' src={clothes['Clothes_Unisex_SpySuit_3C3C3C.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeRandomVariationWithColor('QuantumJacket', setClothesVariation, setClothesIsBlank, setClothesRandom, setClothesGenderVariable, 'Unisex', 'quantumjacket', setClothesColor, '969333')} type='image' src={clothes['Clothes_Unisex_QuantumJacket_969333.PNG']} className='face_buttons' alt='bruh'></input>
            </div>
            <h6 className='button_descriptor'>Hair</h6>
            <div id='hair_buttons_div' className='face_buttons_div'>
              <input onClick={() => selectRandom(setHairRandom, setHairIsBlank, setHairVariation)} type='image' src={hair['random.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeRandomVariationWithColor('Bald', setHairVariation, setHairIsBlank, setHairRandom, setHairGenderVariable, 'Unisex', '', setHairColor, '000000')} type='image' src={faceShape['FaceShape_Man_Light.PNG']} className='face_buttons' disabled = {manDisabled} alt='bruh'></input>
              <input onClick={() => changeRandomVariationWithColor('Bandana', setHairVariation, setHairIsBlank, setHairRandom, setHairGenderVariable, 'Man', 'bandana', setHairColor, '5D3C2F')} type='image' src={hair['Hair_Man_Bandana_5D3C2F.PNG']} className='face_buttons' disabled = {manDisabled} alt='bruh'></input>
              <input onClick={() => changeRandomVariationWithColor('ShortDreadlocks', setHairVariation, setHairIsBlank, setHairRandom, setHairGenderVariable, 'Man', 'dreads', setHairColor, '2C41E1')} type='image' src={hair['Hair_Man_ShortDreadlocks_2C41E1.PNG']} className='face_buttons' disabled = {manDisabled} alt='bruh'></input>
              <input onClick={() => changeRandomVariationWithColor('Spiky', setHairVariation, setHairIsBlank, setHairRandom, setHairGenderVariable, 'Man', 'spiky', setHairColor, '3B2721')} type='image' src={hair['Hair_Man_Spiky_3B2721.PNG']} className='face_buttons' disabled = {manDisabled} alt='bruh'></input>
              <input onClick={() => changeRandomVariationWithColor('Short', setHairVariation, setHairIsBlank, setHairRandom, setHairGenderVariable, 'Unisex', 'short', setHairColor, '103E5B')} type='image' src={hair['Hair_Unisex_Short_103E5B.PNG']} className='face_buttons' alt='bruh'></input>
              <input onClick={() => changeRandomVariationWithColor('Bob', setHairVariation, setHairIsBlank, setHairRandom, setHairGenderVariable, 'Woman', 'bob', setHairColor, '2E1E18')} type='image' src={hair['Hair_Woman_Bob_2E1E18.PNG']} className='face_buttons' disabled = {womanDisabled} alt='bruh'></input>
              <input onClick={() => changeRandomVariationWithColor('Bun', setHairVariation, setHairIsBlank, setHairRandom, setHairGenderVariable, 'Woman', 'bun', setHairColor, '8E6647')} type='image' src={hair['Hair_Woman_Bun_8E6647.PNG']} className='face_buttons' disabled = {womanDisabled} alt='bruh'></input>
              <input onClick={() => changeRandomVariationWithColor('Fringe', setHairVariation, setHairIsBlank, setHairRandom, setHairGenderVariable, 'Woman', 'fringe', setHairColor, '5E1462')} type='image' src={hair['Hair_Woman_Fringe_5E1462.PNG']} className='face_buttons' disabled = {womanDisabled} alt='bruh'></input>
              <input onClick={() => changeRandomVariationWithColor('Braid', setHairVariation, setHairIsBlank, setHairRandom, setHairGenderVariable, 'Woman', 'braid', setHairColor, 'FFFFFF')} type='image' src={hair['Hair_Woman_Braid_FFFFFF.PNG']} className='face_buttons' disabled = {womanDisabled} alt='bruh'></input>
            </div>
          </div>
          <div id='colors_overlay'>
            <button onClick={() => setEyesColor('ACACAC')} style={{background: '#ACACAC'}} className='neweyes_color_buttons'/> 
            <button onClick={() => setEyesColor('D22A16')} style={{background: '#D22A16'}} className='neweyes_color_buttons'/>
            <button onClick={() => setEyesColor('247200')} style={{background: '#247200'}} className='neweyes_color_buttons'/>
            <button onClick={() => setEyesColor('204DA4')} style={{background: '#204DA4'}} className='neweyes_color_buttons'/>
            <button onClick={() => setEyesColor('9E1E60')} style={{background: '#9E1E60'}} className='neweyes_color_buttons'/>
            <button onClick={() => setEyesColor('5D29AA')} style={{background: '#5D29AA'}} className='neweyes_color_buttons'/>
            <button onClick={() => setEyesColor('5C3723')} style={{background: '#5C3723'}} className='neweyes_color_buttons'/>

            <button onClick={() => setEyebrowsColor('000000')} style={{background: '#000000'}} className='eyebrows_color_buttons'/>
            <button onClick={() => setEyebrowsColor('8F2D1A')} style={{background: '#8F2D1A'}} className='eyebrows_color_buttons'/>
            <button onClick={() => setEyebrowsColor('241B7A')} style={{background: '#241B7A'}} className='eyebrows_color_buttons'/>
            <button onClick={() => setEyebrowsColor('D4D0CF')} style={{background: '#D4D0CF'}} className='eyebrows_color_buttons'/>

            <button onClick={() => setFaceShapeVariation('Light')} style={{background: '#ECC29A'}} className='faceshape_color_buttons'/>
            <button onClick={() => setFaceShapeVariation('Medium')} style={{background: '#D3A071'}} className='faceshape_color_buttons'/>
            <button onClick={() => setFaceShapeVariation('MediumPlus')} style={{background: '#AA7E54'}} className='faceshape_color_buttons'/>
            <button onClick={() => setFaceShapeVariation('Dark')} style={{background: '#593E23'}} className='faceshape_color_buttons'/>

            <button onClick={() => setMouthColor('9D6939')} style={{background: '#9D6939'}} className='womanmouth_color_buttons'/>
            <button onClick={() => setMouthColor('482709')} style={{background: '#482709'}} className='womanmouth_color_buttons'/>
            <button onClick={() => setMouthColor('845830')} style={{background: '#845830'}} className='womanmouth_color_buttons'/>
            <button onClick={() => setMouthColor('BC8858')} style={{background: '#BC8858'}} className='womanmouth_color_buttons'/>

            <button onClick={() => setHairColor('5D3C2F')} style={{background: '#5D3C2F'}} className='bandana_color_buttons'/>
            <button onClick={() => setHairColor('797979')} style={{background: '#797979'}} className='bandana_color_buttons'/>
            <button onClick={() => setHairColor('D7A776')} style={{background: '#D7A776'}} className='bandana_color_buttons'/>

            <button onClick={() => setHairColor('2C41E1')} style={{background: '#2C41E1'}} className='dreads_color_buttons'/>
            <button onClick={() => setHairColor('015100')} style={{background: '#015100'}} className='dreads_color_buttons'/>
            <button onClick={() => setHairColor('831633')} style={{background: '#831633'}} className='dreads_color_buttons'/>
            <button onClick={() => setHairColor('EB03F0')} style={{background: '#EB03F0'}} className='dreads_color_buttons'/>

            <button onClick={() => setHairColor('3B2721')} style={{background: '#3B2721'}} className='spiky_color_buttons'/>
            <button onClick={() => setHairColor('B6B2E9')} style={{background: '#B6B2E9'}} className='spiky_color_buttons'/>
            <button onClick={() => setHairColor('B33E13')} style={{background: '#B33E13'}} className='spiky_color_buttons'/>
            <button onClick={() => setHairColor('D6A749')} style={{background: '#D6A749'}} className='spiky_color_buttons'/>

            <button onClick={() => setHairColor('103E5B')} style={{background: '#103E5B'}} className='short_color_buttons'/>
            <button onClick={() => setHairColor('015100')} style={{background: '#015100'}} className='short_color_buttons'/>
            <button onClick={() => setHairColor('40291A')} style={{background: '#40291A'}} className='short_color_buttons'/>
            
            <button onClick={() => setHairColor('A6A6A0')} style={{background: '#770034'}} className='bob_color_buttons'/>
            <button onClick={() => setHairColor('A6A6A6')} style={{background: '#A6A6A6'}} className='bob_color_buttons'/>
            <button onClick={() => setHairColor('BB9140')} style={{background: '#BB9140'}} className='bob_color_buttons'/>
            <button onClick={() => setHairColor('BF3140')} style={{background: '#BF3140'}} className='bob_color_buttons'/>
            <button onClick={() => setHairColor('2E1E18')} style={{background: '#2E1E18'}} className='bob_color_buttons'/>

            <button onClick={() => setHairColor('8E6647')} style={{background: '#8E6647'}} className='bun_color_buttons'/>
            <button onClick={() => setHairColor('C2700E')} style={{background: '#C2700E'}} className='bun_color_buttons'/>
            <button onClick={() => setHairColor('F27231')} style={{background: '#F27231'}} className='bun_color_buttons'/>
 
            <button onClick={() => setHairColor('0B4283')} style={{background: '#0B4283'}} className='fringe_color_buttons'/>
            <button onClick={() => setHairColor('5E1462')} style={{background: '#5E1462'}} className='fringe_color_buttons'/>
            <button onClick={() => setHairColor('64210E')} style={{background: '#64210E'}} className='fringe_color_buttons'/>
            <button onClick={() => setHairColor('215111')} style={{background: '#215111'}} className='fringe_color_buttons'/>
            <button onClick={() => setHairColor('DBDBDB')} style={{background: '#DBDBDB'}} className='fringe_color_buttons'/>

            <button onClick={() => setHairColor('FFFFFF')} style={{background: '#FFFFFF'}} className='braid_color_buttons'/>
            <button onClick={() => setHairColor('536FFF')} style={{background: '#536FFF'}} className='braid_color_buttons'/>
            <button onClick={() => setHairColor('862E31')} style={{background: '#862E31'}} className='braid_color_buttons'/>

            <button onClick={() => setClothesColor('E3BE8A')} style={{background: '#E3BE8A'}} className='astrojacket_color_buttons'/>
            <button onClick={() => setClothesColor('E5E645')} style={{background: '#E5E645'}} className='astrojacket_color_buttons'/>

            <button onClick={() => setClothesColor('648200')} style={{background: '#648200'}} className='camovest_color_buttons'/>
            <button onClick={() => setClothesColor('D43921')} style={{background: '#D43921'}} className='camovest_color_buttons'/>
            <button onClick={() => setClothesColor('7639EB')} style={{background: '#7639EB'}} className='camovest_color_buttons'/>
            <button onClick={() => setClothesColor('D433C6')} style={{background: '#D433C6'}} className='camovest_color_buttons'/>

            <button onClick={() => setClothesColor('3C3C3C')} style={{background: '#3C3C3C'}} className='spysuit_color_buttons'/>
            <button onClick={() => setClothesColor('6A3F79')} style={{background: '#6A3F79'}} className='spysuit_color_buttons'/>
            <button onClick={() => setClothesColor('910B10')} style={{background: '#910B10'}} className='spysuit_color_buttons'/>
            <button onClick={() => setClothesColor('A3A19E')} style={{background: '#A3A19E'}} className='spysuit_color_buttons'/>

            <button onClick={() => setClothesColor('7C7FDF')} style={{background: '#7C7FDF'}} className='wrap_color_buttons'/>
            <button onClick={() => setClothesColor('D43921')} style={{background: '#D43921'}} className='wrap_color_buttons'/>
            <button onClick={() => setClothesColor('F46524')} style={{background: '#F46524'}} className='wrap_color_buttons'/>
            <button onClick={() => setClothesColor('F77095')} style={{background: '#F77095'}} className='wrap_color_buttons'/>

            <button onClick={() => setClothesColor('969333')} style={{background: '#969333'}} className='quantumjacket_color_buttons'/>
            <button onClick={() => setClothesColor('CB62A3')} style={{background: '#CB62A3'}} className='quantumjacket_color_buttons'/>
            <button onClick={() => setClothesColor('E56551')} style={{background: '#E56551'}} className='quantumjacket_color_buttons'/>
            <button onClick={() => setClothesColor('4C2858')} style={{background: '#4C2858'}} className='quantumjacket_color_buttons'/>
            <button onClick={() => setClothesColor('373577')} style={{background: '#373577'}} className='quantumjacket_color_buttons'/>
 
            <button onClick={() => setClothesColor('0F3817')} style={{background: '#0F3817'}} className='chunojacket_color_buttons'/>
            <button onClick={() => setClothesColor('6569DF')} style={{background: '#6569DF'}} className='chunojacket_color_buttons'/>
            <button onClick={() => setClothesColor('EA58FE')} style={{background: '#EA58FE'}} className='chunojacket_color_buttons'/>

            <button onClick={() => setClothesColor('792C2C')} style={{background: '#792C2C'}} className='techjacket_color_buttons'/>
            <button onClick={() => setClothesColor('4348A0')} style={{background: '#4348A0'}} className='techjacket_color_buttons'/>

            <button onClick={() => setClothesColor('1A1A1A')} style={{background: '#1A1A1A'}} className='formalsuit_color_buttons'/>
            <button onClick={() => setClothesColor('1E3370')} style={{background: '#1E3370'}} className='formalsuit_color_buttons'/>
            <button onClick={() => setClothesColor('9E1A1E')} style={{background: '#9E1A1E'}} className='formalsuit_color_buttons'/>
            <button onClick={() => setClothesColor('956CCf')} style={{background: '#956CCf'}} className='formalsuit_color_buttons'/>
            <button onClick={() => setClothesColor('717221')} style={{background: '#717221'}} className='formalsuit_color_buttons'/>
            <button onClick={() => setClothesColor('888684')} style={{background: '#888684'}} className='formalsuit_color_buttons'/>
            <button onClick={() => setClothesColor('B58544')} style={{background: '#B58544'}} className='formalsuit_color_buttons'/>
            <button onClick={() => setClothesColor('D880D1')} style={{background: '#D880D1'}} className='formalsuit_color_buttons'/>
          </div>
          <h6 id = "gallery_text">Accessory Gallery</h6>
          <p id='select_paragraph_3'>All the traits from these categories will be random, good luck</p>
          <div id='gallery'>
            <h6 className='button_descriptor'>Face Details</h6>
            <div className='gallery_buttons_div'>
              <input  type='image' src={faceDetailsUI['IMG_1758.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={faceDetailsUI['IMG_1759.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={faceDetailsUI['IMG_1760.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={faceDetailsUI['IMG_1761.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={faceDetailsUI['IMG_1763.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={faceDetailsUI['IMG_1771.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={faceDetailsUI['IMG_1772.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={faceDetailsUI['IMG_1773.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={faceDetailsUI['IMG_1774.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={faceDetailsUI['IMG_1779.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={faceDetailsUI['IMG_1784.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={faceDetailsUI['IMG_1785.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={faceDetailsUI['IMG_1786.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={faceDetailsUI['IMG_1787.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={faceDetailsUI['IMG_1788.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={faceDetailsUI['IMG_1789.PNG']} alt='bruh' className='accessory_buttons'></input>
            </div>
            <h6 className='button_descriptor'>Front Accessories</h6>
            <div className='gallery_buttons_div'>
            <input  type='image' src={frontAccessories['FrontAccessories_Unisex_Dice_295483.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_Dice_780075.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_Dice_B27AFF.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_Token_3E0D35.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_Token_083143.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_Token_B9491F.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_UFO_3D3785.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_UFO_64073A.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_UFO_353535.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_Drones_8B8EDF.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_Drones_979596.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_Drones_D17992.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_BlueFlyingScans_blue.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_PinkFlyingScans_pink.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_GreenFlyingScans_green.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_MechanicalBees_7787C2.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_MechanicalBees_898989.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_MechanicalBees_A28C39.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_PartyGlassHand_default.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_RoboticHand_default.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={frontAccessories['FrontAccessories_Unisex_SprayHand_default.PNG']} alt='bruh' className='accessory_buttons'></input>
            </div> 
            <h6 className='button_descriptor'>Back Accessories</h6>
            <div className='gallery_buttons_div'>
              <input  type='image' src={backAccessories['BackAccessories_Unisex_Saw_382540.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAccessories_Unisex_Saw_ 642720.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAccessories_Unisex_Saw_1C2B0C.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAccessories_Unisex_TechSpear_5EE8FF.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAccessories_Unisex_TechSpear_991CFF.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAccessories_Unisex_TechSpear_FFFFFF.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Man_Wings_797979.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_Wings_A896FF.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Woman_Wings_DD8AD6.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_Bat_7A8F14.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_Bat_4877FF.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_Bat_F24A3B.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_Bow_7A37AB.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_Bow_3C45AB.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_CellPhones_5E5E5E.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_CellPhones_0037AB.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_CellPhones_58155E.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_Gun_4B4C1B.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_Gun_7B321A.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_Gun_73237E.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_MechanicalArms_8C32D2.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_MechanicalArms_226AC8.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_MechanicalArms_AC3F3D.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_Skate_A0D365.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_Skate_E294FC.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_Skate_EBB345.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_Sword_8A61DD.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_Sword_39A84B.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={backAccessories['BackAcessories_Unisex_Sword_BE7452.PNG']} alt='bruh' className='accessory_buttons'></input>
            </div>
            <h6 className='button_descriptor'>Masks</h6>
            <div className='gallery_buttons_div'>
              <input  type='image' src={maskAccessories['Masks_Unisex_CyberQuantum.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={maskAccessories['Masks_Unisex_EyePatch.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={maskAccessories['Masks_Unisex_Monocle.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={maskAccessories['Masks_Unisex_PinkTransparent.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={maskAccessories['Masks_Unisex_PurpleTech.PNG']} alt='bruh' className='accessory_buttons'></input>
            </div>
            <h6 className='button_descriptor'>Head Accessories</h6>
            <div className='gallery_buttons_div'>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_BubbleGum_6BDE98.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_BubbleGum_94ACF2.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_BubbleGum_EE89C0.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_EarMask_226AC8.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_EarMask_CD3633.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_EarMask_FF12FF.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_GasMask_000000.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_GasMask_5E1462.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_GasMask_141462.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_PurpleTransparent_purple.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_SmokeMask_374D31.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_SmokeMask_3941AD.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_SmokeMask_572361.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_SmokeMask_C4512C.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_Transparent_transparent.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_TransparentGlasses_B6D1FF.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_TransparentGlasses_E5F6FF.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_TransparentGlasses_FDAEFF.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={headAccessories['HeadAccessories_Unisex_VideoMask_default.PNG']} alt='bruh' className='accessory_buttons'></input>
            </div>
            <h6 className='button_descriptor'>Backgrounds</h6>
            <div className='gallery_buttons_div'>
              <input  type='image' src={background['Background_Unisex_ArchDark_1E4884.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_ArchDark_2A6606.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_ArchDark_833B08.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_ArchDark_891880.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_ArchLight_1E4884.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_ArchLight_2A6606.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_ArchLight_833B08.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_ArchLight_891880.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_Gradient_1E4884.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_Gradient_2A6606.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_Gradient_833B08.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_Gradient_891880.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_Haze_1E4884.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_Haze_2A6606.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_Haze_833B08.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_Haze_891880.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_SpotLight_1E4884.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_SpotLight_2A6606.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_SpotLight_833B08.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_SpotLight_891880.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_Streak_1E4884.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_Streak_2A6606.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_Streak_833B08.PNG']} alt='bruh' className='accessory_buttons'></input>
              <input  type='image' src={background['Background_Unisex_Streak_891880.PNG']} alt='bruh' className='accessory_buttons'></input>
            </div>
          </div>
          <div id='product'>
          <img id='merge' className='mergedImage' alt='bruh'/>
          </div> 
          <button id='send_button' onClick={create}>Send</button>
      </header>
    </div>
  );
}

export default App;
export {userAddress, finalPFP, traits, finalPNG, finalJSON}