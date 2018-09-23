const url = "http://plothack.s3-website-us-east-1.amazonaws.com/transformed_data.json";

const fetchedData = []
const fetchData = () => {
    window.fetch(url).then((response) => response.json()).then((myJson) => {
        fetchedData = myJson;
    }).catch(err => console.log(err));
}






