import '../client/styles/style.scss';
import {formHandler, removeData , refreshDisplay} from './js/app.js';

window.addEventListener('load', refreshDisplay);
document.addEventListener('click',function(e){
  if(!e.target) return;
  if(e.target.className == 'removebutton'){
    const parent = e.target.parentElement.parentElement;
    const ul = parent.parentElement
    var pos = -1;
    for(const element of ul.childNodes) {
      if(element == parent) break;
      pos = pos + 1;
    };
    ul.removeChild(parent);
    removeData(pos);
   }
   else if(e.target.id == "add_trip_button") {
    var tmp = document.getElementById("add_trip_section");
    console.log("I am clicked");
    console.log(tmp.style.display == 'none');
    if(tmp.style.display == 'none') {
      tmp.style.display = 'block';
    }
    else {
      tmp.style.display = 'none';
    }
   }
});


export {formHandler};
