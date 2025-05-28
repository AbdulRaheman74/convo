import {createSlice} from "@reduxjs/toolkit"
import SuggestedUser from "../components/SuggestedUser";

const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedUsers:[],
        userProfile:null,
        selectedUser:null
    },
    reducers:{
        //action
        setAuthUser:(state,action)=>{
            state.user=action.payload;
            
        },
        setSuggestedUsers:(state,action)=>{
            state.suggestedUsers=action.payload
        },
        setUserProfile:(state,action)=>{
            state.userProfile=action.payload
        },
        setSelectedUsers:(state,action)=>{
            state.selectedUser=action.payload
        }

    }
});

export const  {setAuthUser,setSuggestedUsers,setUserProfile,setSelectedUsers} = authSlice.actions
export default authSlice.reducer