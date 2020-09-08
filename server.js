const express= require('express');
const mysql=require('mysql');
const bodyparser=require('body-parser');
const cors= require('cors');
const { date } = require('joi');
const nodemailer=require('nodemailer');
var CodeGenerator = require('node-code-generator');
var generator = new CodeGenerator();
var pattern = 'ABC#+';
var howMany = 100;
var options = {};
var mydata=[]
const app =new express();
app.listen(7777);

const con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"restaurant"
})
con.connect((err)=>{
    if(err){
        console.log("error");
    }
    else{
        console.log("connected");
    }
})
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'harrollins@gmail.com',
      pass: 'khalilmessi1994'
    }
  });


app.use(bodyparser.json());
app.use(cors());


console.log("app listrenin on port :"+7777);






app.post("/home",cors(),(req,res)=>{
    const verif="On attente";
    let fullname=req.body.fullname
    let nemail=req.body.nemail
    let ntelephone=req.body.ntelephone
    let npersonne=req.body.npersonne
    let datereserv=req.body.datereserv;
    let dot=req.body.dot;
    let datefaite=req.body.datefaite;
    let helper=req.body.helper;
      const query1="SELECT datefaite  FROM reservation WHERE ntelephone=+'"+ntelephone+"'ORDER BY dot DESC LIMIT 1";
      con.query(query1,function(err,result){
           if(err){
               res.send(err);
           }else {
               if(result.length==0){
                var codes = generator.generateCodes(pattern, howMany, options);
                var mailOptions = {
                    from: 'harrollins@gmail.com',
                    to: nemail,
                    subject: 'Sending Email using Node.js',
                    text: `votre code de verification :${codes[0]} `
                  };
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
                const query2="INSERT INTO reservation (ntelephone,fullname,datereserv,npersonne,verif,dot,datefaite,helper,code) VALUES('"+ntelephone+"','"+fullname+"','"+datereserv+"','"+npersonne+"','"+verif+"','"+dot+"','"+req.body.datefaite+"','"+helper+"','"+codes[0]+"')";
                con.query(query2,function(err,result){
                    if(err){
                        console.log(err);
                    }
                      
                    else{
                       console.log("inserted");
                       res.send("inserted");
                    }
                })
               }else{
                   
                  var year=result[0].datefaite.getFullYear();
                  var month=result[0].datefaite.getMonth()+1;
                  var day=result[0].datefaite.getDate();
                  if(year==new Date().getFullYear() && month==new Date().getMonth()+1 && day==new Date().getDate()){
                    res.send("this number already made a reservation");
         
                  } 
                   else{
                    var codes = generator.generateCodes(pattern, howMany, options);
                    var mailOptions = {
                        from: 'harrollins@gmail.com',
                        to: nemail,
                        subject: 'Sending Email using Node.js',
                        text: `votre code de verification :${codes[0]} `
                      };
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                      });
                    const query2="INSERT INTO reservation (ntelephone,fullname,datereserv,npersonne,verif,dot,datefaite,helper) VALUES ('"+ntelephone+"','"+fullname+"','"+datereserv+"','"+npersonne+"','"+verf+"','"+dot+"','"+datefaite+"','"+helper+"')";
                    con.query(query2,function(err,result){
                        if(err){
                            console.log(err);
                        }
                          
                        else{
                           console.log("inserted");
                           res.send("inserted");
                        }
                    })
                   }
               }
           }
                
        })

})
app.get("/test",(req,res)=>{
    const query="SELECT CONVERT_TZ(dot,'+00:00','+01:00') FROM reservation WHERE verif='On attente'";
    con.query(query,function(err,result){
        if(err){
            console.log(err)
        }else{
         
            res.send(result);
       }
     })

})
app.get("/reservation",(req,res)=>{
  
    
    
    const query="SELECT ntelephone,fullname,datereserv,npersonne,verif,dot FROM reservation WHERE  code_verification='code verifiee' AND verif='On attente'";
    con.query(query,function(err,result){
        if(err){
            console.log(err)
        }else{
             let tosend={
                 data:result
             }
            res.send(tosend);
            
       }
     })
})
'1999-04-26 13:00:00'
app.get("/confirmed",(req,res)=>{
    const query="SELECT *FROM reservation WHERE verif='Verifié'";
    con.query(query,function (err,result) {
        if(err){
            console.log(err)
        }else{
            let tosend={
                data:result
            }
            res.send(tosend);
        }
    })
})
app.post("/delete",(req,res)=>{
    let dot=req.body.sending;
    let dot2=req.body.sending2;
    let bibi=dot.slice(0,10);
    let bibi2=dot.slice(11,19);
    let finaldate=bibi+" "+bibi2;
    console.log(finaldate);

    
    const query="UPDATE reservation SET verif='Supprimé' WHERE dot='"+dot+"' AND ntelephone='"+dot2+"'";
    con.query(query,function(err,result) {
         if(err){
             console.log(err)
         }else{
             console.log("deleted");
         }
    })
})
app.post("/confirmer",(req,res)=>{
    let dot=req.body.sending;
    let dot2=req.body.sending2;
    //let bibi=dot.slice(0,10);
    //let bibi2=dot.slice(11,19);
    //let finaldate=bibi+" "+bibi2;
    //console.log(finaldate);
    const query="UPDATE reservation SET verif='Verifié' WHERE dot='"+dot+"' AND ntelephone='"+dot2+"'";
    con.query(query,function(err,result) {
         if(err){
             console.log(err)
         }else{
             console.log("updated");
         }
    })
})
app.get("/count",(req,res)=>{
    let helper=req.body.helper;
    let day=new Date().getDate();
    let month=new Date().getMonth()+1
    let year=new Date().getFullYear();
    let full=year+"-"+month+"-"+day;
   
    
    //res.send(full);
 
    const query="SELECT COUNT(*) as number FROM reservation where helper='"+full+"' AND verif='On attente'";
    con.query(query,(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send(result);
        }
    })
})
app.get("/count2",(req,res)=>{
    let helper=req.body.helper;
    let day=new Date().getDate();
    let month=new Date().getMonth()+1
    let year=new Date().getFullYear();
    let full=year+"-"+month+"-"+day;
    
    //res.send(full);
    const query="SELECT COUNT(*) as number FROM reservation where helper='"+full+"' AND verif='Verifié'";
    con.query(query,(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send(result);
        }
    })
})
app.post("/news-letter",(req,res)=>{
    let email=req.body.email;
    const query="INSERT INTO newsletter VALUES('"+email+"')";
    con.query(query,(err,result)=>{
        if(err){
            console.log("error")
        }else{
            res.send(result);
        }
    })
})
app.post("/verifycode",(req,res)=>{
    let code=req.body.codesent;
    console.log(code);

    const query="SELECT *FROM reservation WHERE code=+'"+code+"'";
    con.query(query,(err,result)=>{
        if(err){
            console.log(err)
        }
        else if(result.length==0){
             res.send("wrong verification code");
        }
        else{
            const queryy="UPDATE reservation SET code_verification='code verifiee'";
            con.query(queryy,(err,result)=>{
                if(err){
                    console.log(err)
                }
               else{
                res.send("success");
                }
            })
        }
    })
})
app.get("/reservepermonth",(req,res)=>{
       var dataa=[]
        const query1="SELECT COUNT(*) AS number FROM reservation WHERE DATE_FORMAT(datefaite,'%Y-%m') ='2020-01' AND code_verification='code verifiee' ";
        const query2="SELECT COUNT(*) AS number FROM reservation WHERE DATE_FORMAT(datefaite,'%Y-%m') ='2020-02' AND code_verification='code verifiee' ";
       const query3="SELECT COUNT(*) AS number FROM reservation WHERE DATE_FORMAT(datefaite,'%Y-%m') ='2020-03' AND code_verification='code verifiee' ";
        const query4="SELECT COUNT(*) AS number FROM reservation WHERE DATE_FORMAT(datefaite,'%Y-%m') ='2020-04' AND code_verification='code verifiee' ";
        const query5="SELECT COUNT(*) AS number FROM reservation WHERE DATE_FORMAT(datefaite,'%Y-%m') ='2020-05' AND code_verification='code verifiee' ";
        const query6="SELECT COUNT(*) AS number FROM reservation WHERE DATE_FORMAT(datefaite,'%Y-%m') ='2020-06' AND code_verification='code verifiee' ";
        const query7="SELECT COUNT(*) AS number FROM reservation WHERE DATE_FORMAT(datefaite,'%Y-%m') ='2020-07' AND code_verification='code verifiee' ";
        const query8="SELECT COUNT(*) AS number FROM reservation WHERE DATE_FORMAT(datefaite,'%Y-%m') ='2020-08' AND code_verification='code verifiee' ";
        const query9="SELECT COUNT(*) AS number FROM reservation WHERE DATE_FORMAT(datefaite,'%Y-%m') ='2020-09' AND code_verification='code verifiee' ";
        const query10="SELECT COUNT(*) AS number FROM reservation WHERE DATE_FORMAT(datefaite,'%Y-%m') ='2020-10' AND code_verification='code verifiee' ";
        const query11="SELECT COUNT(*) AS number FROM reservation WHERE DATE_FORMAT(datefaite,'%Y-%m') ='2020-11' AND code_verification='code verifiee'";
        const query12="SELECT COUNT(*) AS number FROM reservation WHERE DATE_FORMAT(datefaite,'%Y-%m') ='2020-12' AND code_verification='code verifiee' ";
        con.query(query1,(err,result)=>{
            if(err){
                console.log(err)
            }else{
                dataa.push(result);
               
                 
                }
                
            
          })
          con.query(query2,(err,result)=>{
            if(err){
                console.log(err)
            }else{
                dataa.push(result);
               
                 
                }
                
            
          })
          con.query(query3,(err,result)=>{
            if(err){
                console.log(err)
            }else{
                dataa.push(result);
               
                 
                }
                
            
          })
          con.query(query4,(err,result)=>{
            if(err){
                console.log(err)
            }else{
                dataa.push(result);
               
                 
                }
                
            
          })
          con.query(query5,(err,result)=>{
            if(err){
                console.log(err)
            }else{
                dataa.push(result);
               
                 
                }
                
            
          })
          con.query(query6,(err,result)=>{
            if(err){
                console.log(err)
            }else{
                dataa.push(result);
               
                 
                }
                
            
          })
          con.query(query7,(err,result)=>{
            if(err){
                console.log(err)
            }else{
                dataa.push(result);
               
                 
                }
                
            
          })
          con.query(query8,(err,result)=>{
            if(err){
                console.log(err)
            }else{
                dataa.push(result);
               
                 
                }
                
            
          })
          con.query(query9,(err,result)=>{
            if(err){
                console.log(err)
            }else{
                dataa.push(result);
               
                 
                }
                
            
          })
          con.query(query10,(err,result)=>{
            if(err){
                console.log(err)
            }else{
                dataa.push(result);
               
                 
                }
                
            
          })
          con.query(query11,(err,result)=>{
            if(err){
                console.log(err)
            }else{
                dataa.push(result);
               
                 
                }
                
            
          })
          con.query(query12,(err,result)=>{
            if(err){
                console.log(err)
            }else{
                dataa.push(result);
                //res.send(dataa);
                 res.send(dataa)
                }
                
            
          })
    
    
    
    
    //const query="SELECT *FROM reservation WHERE DATE_FORMAT(datefaite,'%Y-%m') ='2020-09';"

})
app.get("/tabledata",(req,res)=>{
    const query="SELECT numero FROM tablee where available='oui'";
    con.query(query,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            res.send(result);
        }
    })
})
app.post("/mobile",(req,res)=>{
   let name=req.body.name
   mydata.push(req.body.name);
  

    
   
})

app.get("/yaho",(req,res)=>{
    res.send("yaho")
}

)
console.log(mydata);