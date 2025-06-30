"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import styles from "./home.module.css";


export default function HomePage(){
    const colors=[
        '#f44336',
        '#ff9800',
        '#ffeb3b',
        '#8bc34a',
        '#4caf50',
        '#009688',
        '#00bcd4',
        '#2196f3',
        '#3f51b5',
        '#9c27b0',
        '#e91e63',
        '#795548',
    ];

    const router=useRouter();
    const [selected,setSelected]=useState([]);

    const toggleColor=(color)=>{
        setSelected((prev)=>{
            if (prev.includes(color)){
                return prev.filter((c)=>c !==color);
            }else if(prev.length<2){
                return [...prev,color];
            }else{
                return prev;
            }
        });
    };

    const handleSearch=()=>{
        if (selected.length === 2){
            router.push(`/result?color1=${encodeURIComponent(selected[0])}&color2=${encodeURIComponent(selected[1])}`);
        }else{
            alert('二色選んでください');
        }
    };

    const onDropColor=(index,color)=>{
        setSelected(prev=>{
            const updated=[...prev];
            updated[index]=color;
            return updated.slice(0,2);
        })
    };

    function DropBox({color,index,onDropColor}){
        return(
            <div
                onDragOver={(e)=>e.preventDefault()}
                onDrop={(e)=>{
                    const droppedColor=e.dataTransfer.getData('color');
                    onDropColor(index,droppedColor);
                }}
                className={styles.dropBox}
                style={{backgroundColor:color !=="" ? color: "lightgray"}}
            >
                {color ? "" : "ここにドロップ"}
            </div>
        )
    }
    

    return(
        <div>
            <div className={styles.frame}>  
                <DropBox color={selected[0]} index={0} onDropColor={onDropColor}></DropBox>
                <DropBox color={selected[1]} index={1} onDropColor={onDropColor}></DropBox>
            </div>
            <div className={styles.circle}>
                {colors.map((color,i)=>{
                    const angle=(360/colors.length)*i;
                    return(
                        <div
                            key={i}
                            draggable
                            onDragStart={(e)=>e.dataTransfer.setData('color',color)}
                            className={styles.card}
                            onClick={()=>toggleColor(color)}
                            style={{
                                transform:`rotate(${i*30}deg) translate(220px) rotate(-${i*30}deg)`,
                                backgroundColor:color,
                                border: selected.includes(color) ? "3px solid white" : "none",
                                boxShadow: selected.includes(color) ? "0 0 10px white" : "none",
                                cursor: "pointer",
                            }}
                        >
                        </div>
                    );
                })}
            </div>
            
            <div className={styles.btn}>
                <button onClick={handleSearch}>検索</button>
            </div>
        </div>
    )
}