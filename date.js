function getDate(){
    const options={weekday:'long',month:'long',day:'numeric'};
    const today=new Date();
    return today.toLocaleDateString("en-US",options);
}
function getDay(){
    const day=(new Date()).getDay();
    const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return days[day];
}
module.exports={
    getDate,
    getDay,
};