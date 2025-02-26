async function Procedure(event)
{
    event.preventDefault();
    const homeresponse = await fetch('/Details/Procedure', {
        method: 'GET',
        credentials: 'include'
    });

    if (homeresponse.ok) {
        const loginhtml = await homeresponse.text();
        const wrapper = document.querySelector('.wrapper');
        wrapper.innerHTML = loginhtml;
    }
}

async function About(event) {
    event.preventDefault();
    const homeresponse = await fetch('/Details/About', {
        method: 'GET',
        credentials: 'include'
    });

    if (homeresponse.ok) {
        const loginhtml = await homeresponse.text();
        const wrapper = document.querySelector('.wrapper');
        wrapper.innerHTML = loginhtml;
    }
}
async function FAQs(event) {
    event.preventDefault();
    const homeresponse = await fetch('/Details/FAQs', {
        method: 'GET',
        credentials: 'include'
    });

    if (homeresponse.ok) {
        const loginhtml = await homeresponse.text();
        const wrapper = document.querySelector('.wrapper');
        wrapper.innerHTML = loginhtml;
    }
}