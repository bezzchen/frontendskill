'use strict';
document.getElementById('booking-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const message=document.getElementById('confirmation');message.textContent=`Thanks, ${form.elements.name.value.trim()}. Your place is reserved for ${form.elements.session.value}.`;message.hidden=false;message.tabIndex=-1;message.focus();});

