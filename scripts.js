// ================== Capture Current Location

let lat
let lon
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    lat = position.coords.latitude,
    lon = position.coords.longitude

    const myAddressUrl=`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${placesKey}`
    // console.log(myAddressUrl)
    $.getJSON(myAddressUrl,(addressData)=>{   
        const myCurrAddress =  addressData.results[0].formatted_address
            // console.log(myCurrAddress)
        document.querySelector('.input-location').placeholder =`${myCurrAddress}`
    })        
    })
}



// ========================================= =======================  Pull price point from Search

    $('.search-form').submit((e)=>{
        e.preventDefault();

        // ================== Google Places URL STart
        
        const googlePlaceUrl = "https://maps.googleapis.com/maps/api/place"
        

            // ================== Generate Parameters for Google Nearby Search URL
                const currLocation = `${lat},${lon}`
                const searchType = "nearbysearch"
                const language = "en"
                const price = $('.input-price').val();
                const type = "restaurant"
                const rankby = "distance" 


        
        // ================== Final Search - Nearby Search URL
    
        // Parameters needed for nearby search = api key, minprice, type, rankyby, location, language, opennow
        
        const googleUrl = `${googlePlaceUrl}/${searchType}/json?key=${placesKey}&minprice=${price}&maxprice=${price}&type=${type}&rankby=${rankby}&location=${currLocation}&language=${language}&opennow;`
            console.log(googleUrl)

        // =================================== Get Results Data

        

            // ================= Get location id and photo reference number from Nearby Serach URL – First Result
            
            $.getJSON(googleUrl,(searchData)=>{

                // Get Random Number Based on googleUrl results to make sure we get a unique rest. each search
                const nearbySearchLength = (searchData.results).length
                    // console.log(photoLength)
                const nearbySearchNumber = (Math.floor(Math.random() * Math.floor(nearbySearchLength))) + 1;

                // console.log(searchData.results[nearbySearchNumber].place_id)

                const placeId = searchData.results[nearbySearchNumber].place_id
                    // console.log(placeId)

                // Calculate Place Location (to get distance variable further below)
                const placeLat = searchData.results[nearbySearchNumber].geometry.location.lat
                const placeLon = searchData.results[nearbySearchNumber].geometry.location.lng
                const placeLocation = `${placeLat},${placeLon}`

                const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${currLocation}&destinations=${placeLocation}&language=${language}&key=${distanceKey}`
                    console.log(distanceUrl)     
                
                $.getJSON(distanceUrl,(distInMiles)=>{
                    const placeDistance = distInMiles.rows[0].elements[0].distance.text
                        $(".distance").html(`${placeDistance}`);
                })    



                // ==================================================== Assemble Details URL

                const detailsUrl = `${googlePlaceUrl}/details/json?placeid=${placeId}&key=${placesKey}&fields=name,formatted_address,rating,website,price_level,review,photos`
                    console.log(detailsUrl)

                // ================= Pull Details URL Data

                $.getJSON(detailsUrl,(searchDetails)=>{
                    const restName = searchDetails.result.name;
                    $(".result-name").html(`${restName}`);
                    const website = searchDetails.result.website;
                    $(".result-site").html(`${website}`);
                    const address = searchDetails.result.formatted_address;
                    $(".result-add").html(`${address}`);
                    const restRating = searchDetails.result.rating;
                    $(".main-score").html(`${restRating}`);
                    const priceLevel = searchDetails.result.price_level
                    console.log(price)
                    console.log(priceLevel)
                    let priceDescription
                    if (priceLevel == 1){
                        priceDescription = "$10 and Under"
                    } else if (priceLevel == 2){
                        priceDescription = "$11 – 30"
                    } else if (priceLevel == 3){
                        priceDescription = "$31 – 60"
                    } else if (priceLevel == 4) {
                        priceDescription = "$61 – Over"
                    } else {
                        priceDescription = "Pricing Unavailable"
                    }
                    $(".price-range").html(`${priceDescription}`);

                   // ================== Review Info
                        // Create Random Number based on number of review length
                        // This lets pull a different review every time
                        const reviewsLength = (searchDetails.result.reviews).length
                            // console.log(reviewsLength)
                        const reviewsNumber = (Math.floor(Math.random() * Math.floor(reviewsLength))) + 1;

                        const reviewUserName = searchDetails.result.reviews[reviewsNumber].author_name;
                        // console.log(reviewUserName);
                        // console.log(reviewUserName);
                        $(".review-username").html(`${reviewUserName}`);
                        const reviewRating = searchDetails.result.reviews[reviewsNumber].rating;
                            // console.log(reviewRating);
                            // console.log(reviewRating);
                        $(".review-score").html(`${reviewRating}`);
                        const reviewText = searchDetails.result.reviews[reviewsNumber].text;
                            // console.log(reviewText);
                            // console.log(reviewText);
                        $(".review-text").html(`${reviewText}`);
                    
                    // ================== Rest Photo

                     // Create Random Number based on number of photos results length, just like for reviews
                    const photoLength = (searchDetails.result.photos).length
                    //  console.log(photoLength)
                     const photoNumber = (Math.floor(Math.random() * Math.floor(photoLength))) + 1;

                    // Photo Reference Number
                     const photoRef = searchDetails.result.photos[photoNumber].photo_reference

                    //  Define desired Height and Width
                    // const photoHeight = searchDetails.result.photos[photoNumber].height
                    const photoWidth = searchDetails.result.photos[photoNumber].width

                    // Create Photo Url
                    const restPhotoUrl = `${googlePlaceUrl}/photo?maxwidth=${photoWidth}&photoreference=${photoRef}&key=${placesKey}`
                        // console.log(restPhotoUrl)

                });
    });
});

// =================================================================================================================== Generate Background Image

function chooseBackground(){

    // ========================= Select Random Number for BG Image
    const backgroundImage = (Math.floor(Math.random() * Math.floor(8))) + 1;

    // ========================= Determine Where to Attach BG Image Based on Screen Size
    function checkScreen(size){
        if(size.matches){
            document.querySelector('.page-body').style.backgroundImage = `url('images/backgroundImage${backgroundImage}.jpg')`;
            document.querySelector('.tagline-box').style.backgroundImage = `none`;
        }
        else{
            document.querySelector('.tagline-box').style.backgroundImage = `url('images/backgroundImage${backgroundImage}.jpg')`;
            document.querySelector('.page-body').style.backgroundImage = `none`;
        }
    }

    let param = window.matchMedia("(min-width:40rem)");
    checkScreen(param);
    param.addListener(checkScreen);
}

chooseBackground();