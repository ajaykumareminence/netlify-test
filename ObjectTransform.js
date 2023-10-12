import keysToCovert from "./keysToConvert.json" assert {type: 'json'};
const existingKeys = {
    departure_month: 'DepartureMonth',
    no_of_adults: 'NoOfAdults',
    region_id: 'RegionId',
    sid: 'SID',
    cruise_length: 'CruiseLength',
    cruise_line_id: 'CruiseLineId',
    cruise_line_ship_id: 'CruiseLineShipId',
    departure_port: 'DeparturePort',
    occupancy: 'Occupancy',
    no_of_infants: 'NoOfInfants',
    session_key: 'SessionKey',
    cruise_line: 'CruiseLine',
    cart_id: 'cartId',
    pl_aft: 'pL_Aft',
    pl_midship: 'pL_Midship',
    pl_forward: 'pL_Forward',
    pl_no_preference: 'pL_NoPreference',
    special_request: 'specialRequest',
    dinning_late: 'dinning_Late',
    dinning_early: 'dinning_Early',
    dinning_seating_code: 'dinningSeatingCode',
    dinning_seating_table: 'dinningSeatingTable',
    ship_result_number: 'Resultno',
    basket_key: 'Basketkey',
    cabin_result_number: 'Cabinresult',
    grade_number: 'Gradeno',
    item_key: 'itemkey',
    first_name: 'firstName',
    middle_name: 'middleName',
    last_name: 'lastName',
    phone_number: 'phoneNumber',
    guest_type: 'guestType',
    zip_code: 'zipCode',
    guest_country_name: 'guestCountryName',
    guest_country_sort_name: 'guestCountrySortname',
    page_number: 'pageNumber',
    page_size: 'pageSize',
    search_term: 'searchTerm',
    product_code: 'code',
};

function convertToSnakeCase(input) {
    let output = '';
    for (let i = 0; i < input.length; i++) {
        const currentChar = input[i];
        
        if (currentChar === currentChar.toUpperCase() && currentChar !== currentChar.toLowerCase() && i !== 0) {
            output += '_' + currentChar.toLowerCase();
        } else {
            output += currentChar.toLowerCase(); //first key might be capital
        }
    }
    return output;
}
function objectTaker(inputObject){
    const outputObject = {};
    for(const key in inputObject){
        const snakeCasekey = isDefined(key);
        if(typeof inputObject[key] == "object"){
            if(Array.isArray(inputObject[key])){
                const arrOutput = arrayTaker(inputObject[key])
                Object.assign(outputObject,{ [snakeCasekey]: arrOutput} )
                continue
            }else{
                const objOutput = objectTaker(inputObject[key]);
                Object.assign(outputObject, { [snakeCasekey]: objOutput})
                continue;
            }
        }
        Object.assign(outputObject, { [snakeCasekey]: inputObject[key] })
    }
    return outputObject;
}

function arrayTaker(inputArr){
    return inputArr.map(v=>{
        if(typeof v == "object"){
            if(Array.isArray(v)){
                return arrayTaker(v)
            }
            return objectTaker(v)
        }
        return v;
    })
}

function isDefined(key){
    for(const defined_key in existingKeys){
        if(existingKeys[defined_key] === key){
            return defined_key;
        }
    }
    return convertToSnakeCase(key)

}
console.log(objectTaker({"SID": 'sid'}))