const getBtn =
document.getElementById("getBtn");

const loading =
document.getElementById("loading");

const resultContainer =
document.getElementById("resultContainer");

const tableBody =
document.getElementById("tableBody");

const container =
document.querySelector(".container");

const backBtn =
document.getElementById("backBtn");

const studentName =
document.getElementById("studentName");

const studentReg =
document.getElementById("studentReg");

const cutoffBox =
document.getElementById("cutoffBox");

const downloadBtn =
document.getElementById("downloadBtn");

/* GET MARKS */

getBtn.addEventListener(
   "click",

   async ()=>{

      try{

         // SHOW LOADING

         loading.classList.remove(
            "hidden"
         );

         // HIDE FORM

         container.classList.add(
            "hidden"
         );

         // HIDE RESULT

         resultContainer.classList.add(
            "hidden"
         );

         // FETCH RESULT

         const data =
         await fetchResult();

         // INVALID RESULT

         if(!data){

            loading.classList.add(
               "hidden"
            );

            container.classList.remove(
               "hidden"
            );

            resultContainer.classList.add(
               "hidden"
            );
             document.getElementById(
      "regno"
   ).value = "";

   document.getElementById(
      "dob"
   ).value = "";
            return;

         }

         // HIDE LOADING

         loading.classList.add(
            "hidden"
         );

         // SHOW RESULT

         resultContainer.classList.remove(
            "hidden"
         );

         // STUDENT INFO

         studentName.innerText =
         data.name;

         studentReg.innerText =
         data.regNo;

         // RESET CUTOFF BOX

        /* FAIL STUDENT */

if(data.fail){

   cutoffBox.innerHTML = `

      <div class="box">

         <p>Total Mark</p>

         <h1>${data.total}</h1>

      </div>

      <div class="box medical-box">

         <p>Result Status</p>

         <h2>FAIL</h2>

      </div>

   `;

}

/* PASS STUDENT */

else{

   cutoffBox.innerHTML = `

      <div class="box">

         <p>Total Mark</p>

         <h1>${data.total}</h1>

         <p>Total Percentage</p>

         <h2>${data.percentage}</h2>

      </div>

      <div class="box active">

         <p>Result Status</p>

         <h2>PASS</h2>

      </div>

   `;

}

         // ENGINEERING

         if(data.cutoff){

            cutoffBox.innerHTML += `

               <div class="box active">

                  <p>
                     Engineering Cutoff
                  </p>

                  <h2>
                     ${data.cutoff}
                  </h2>

               </div>

            `;

         }

         // MEDICAL

         if(data.medicalCutoff){

            cutoffBox.innerHTML += `

               <div class="box medical-box">

                  <p>
                     Medical Cutoff
                  </p>

                  <h2>
                     ${data.medicalCutoff}
                  </h2>

               </div>

            `;

         }

         // RESET TABLE

         tableBody.innerHTML = "";

         // SUBJECTS

         data.subjects.forEach((sub)=>{

            tableBody.innerHTML += `

               <tr>

                  <td>
                     ${sub.subject}
                  </td>

                  <td>
                     ${sub.internal}
                  </td>

                  <td>
                     ${sub.theory}
                  </td>

                  <td>
                     ${sub.practical}
                  </td>

                  <td>
                     ${sub.total}
                  </td>

                  <td>

                     ${
                        sub.total >= 35

                        ? "PASS"

                        : "FAIL"
                     }

                  </td>

               </tr>

            `;

         });

      }

      catch(err){

         console.log(err);

         loading.classList.add(
            "hidden"
         );

         container.classList.remove(
            "hidden"
         );

         resultContainer.classList.add(
            "hidden"
         );

         alert(
            "Unable to fetch result"
         );

      }

});

/* BACK BUTTON */

backBtn.addEventListener(
   "click",

   ()=>{

      resultContainer.classList.add(
         "hidden"
      );

      container.classList.remove(
         "hidden"
      );

       document.getElementById(
         "regno"
      ).value = "";

      document.getElementById(
         "dob"
      ).value = "";

});

/* API FUNCTION */

async function fetchResult(){

   try{

      const regNo =
      document.getElementById(
         "regno"
      ).value;

     const rawDob =
document.getElementById("dob").value;

const dob =
rawDob
.split("-")
.reverse()
.join("/");

      const response =
      await fetch(

          "/get-result",

         {

            method:"POST",

            headers:{
               "Content-Type":
               "application/json"
            },

            body:JSON.stringify({

               regNo,
               dob

            })

         }

      );

      const result =
      await response.json();

      console.log(result);

      // INVALID

      if(!result.success){

         alert(
            result.message
         );

         return null;

      }

      return result.data;

   }

   catch(err){

      console.log(err);

      return null;

   }

}

/* DOWNLOAD PDF */

downloadBtn.addEventListener(
   "click",

   async ()=>{

      // HIDE BUTTON

      downloadBtn.style.display =
      "none";
      backBtn.style.display =
"none";

      // WAIT UI UPDATE

      await new Promise(resolve =>

         setTimeout(resolve,500)

      );

      const element =
      document.querySelector(
         ".result-card"
      );
      element.classList.add("pdf-mode");
      element.style.maxWidth = "760px";

      const options = {

         

         filename:
         "TN_Result.pdf",

         image:{
            type:"jpeg",
            quality:1
         },

        html2canvas:{
   scale:3,
   scrollY:0,
   useCORS:true,
   windowWidth: document.body.scrollWidth
  
},

         jsPDF:{
            unit:"in",
            format:"a4",
            orientation:"portrait"
         },

      };

      await html2pdf()
      .set(options)
      .from(element)
      .save();

      // SHOW BUTTON
      element.classList.remove("pdf-mode");
      element.style.maxWidth = "850px";
      backBtn.style.display =
"block";
      downloadBtn.style.display =
      "block";

});