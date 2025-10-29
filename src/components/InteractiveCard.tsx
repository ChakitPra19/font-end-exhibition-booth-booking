'use client'
import React from 'react';


export default function InteractiveCard( { children, contentName } : { children: React.ReactNode, contentName:string } ){
    function onVenueSelected() {
        alert("You select " + contentName)
    }
    function onVenueMouseAction(event: React.SyntheticEvent) {
        if(event.type=='mouseover'){
            event.currentTarget.classList.remove('shadow-lg')
            event.currentTarget.classList.add('shadow-2xl')
            event.currentTarget.classList.remove('rounded-lg')
            event.currentTarget.classList.add('rounded-lg')
            event.currentTarget.classList.remove('bg-white')
            event.currentTarget.classList.add('bg-neutral-200')
        }else{
            event.currentTarget.classList.remove('shadow-2xl')
            event.currentTarget.classList.add('shadow-lg')
            event.currentTarget.classList.remove('bg-neutral-200')
            event.currentTarget.classList.add('bg-white')
        }
    }
    return (
        <div className="w-[250px] h-[300px] bg-white shadow-lg rounded-lg pt-2.5 overflow-hidden" 
        // onClick={ ()=>onVenueSelected()}
        onMouseOver={ (e)=>onVenueMouseAction(e) }
        onMouseOut={ (e)=>onVenueMouseAction(e) }>
            { children }
        </div>
    )
}