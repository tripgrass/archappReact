'use strict';
import { Platform, StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    mainContainer: {
        flex: 1,
        minHeight:'100vh',
        display:'flex',
        flexDirection:'column',
        padding: 10,
        color:'white',
        width:'100%',
    },
    mainContentContainer: {
        //alignItems: 'center',
        //justifyContent: 'center'
    },
    formIcon:{
        display:'flex-inline',
        height:34,
        width:34,
        borderRadius:18,
    },    
    formSection:{
        flex: 1,
        width:'100%',
    },
    formButtonSection:{
//        display:'flex',
//        backgroundColor:'red',
        zIndex:999,
        backgroundColor:'rgba(140, 140, 140, .8)',
        position:'absolute',
        bottom:0,
        padding:10,
        paddingBottom:20,
        width:'100%',
    },
    formSectionTitleWrapper:{
        display: 'flex-inline',
        alignItems:'center',
        flexDirection:'row',
        marginTop:40,
        marginBottom:5
    },
    formSectionTitle:{
        display:'flex-inline',
        fontWeight:'600',
        fontSize:26,
    },    
    formOuterWrapper:{
        display:'flex',
        textAlign:'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom:80

    },
    formWrapper:{
        padding:10,
        display:'inline-block',
        textAlign:'center',
        width:'100%',
        maxWidth:  ( (Platform.OS !== 'web') ? '100%' : '1100px' )        
    },
    formWrapperTwo:{
        flex:1    ,
        padding:10,
    },
    h1:{
        fontSize:30,
        fontWeight:600
    },
    input:{
        backgroundColor: 'white',
        borderColor: 'none',
        height: 40,
        padding: 10,
        borderRadius: 4,  
        width:'100%'      
    },
    labelWrapper:{
        display: 'flex-inline',
        alignItems:'center',
        flexDirection:'row'        
    },
    label: {
        margin:5,
        marginLeft: 0,
    },
    link:{
        margin:20
    },
    formButton: {
        marginTop:10,
        elevation: 3,
        borderRadius: 4,
        backgroundColor:'gray'
    }, 
    formButtonAction:{
        marginTop:10,
        elevation: 3,
        borderRadius: 4, 

    },
    fieldWrapper:{
    },
    fieldWrapperHalfContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        gap:10
    },
    fieldWrapperHalf:{
        flex:2,
    },
    fieldsWrapperContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        flex:1,
        gap:10,
    },
    fieldsWrapper:{
        flex:1
    },
    popupContent: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderColor: "#000",
        minHeight: 150,
        padding:20

    }, 
    pressableButton: {
        marginTop:10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'white',
        elevation:3,
        border: 'solid 1px #d8d8d8'
    },
    pressableButtonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
    },    
    pressableButtonAction: {
        marginTop:6,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        elevation: 3,
        backgroundColor: 'white',
        marginLeft: 'auto'        
    },
    pressableButtonActionText: {
        fontSize: 10,
        lineHeight: 18,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
    },        

});