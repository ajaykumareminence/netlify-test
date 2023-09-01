import Validator from "validatorjs";
import _ from "lodash";

Validator.register('password_regex', function (value, requirement, attribute) { // requirement parameter defaults to null
    return value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
}, 'Password must contains atleast 8 characters with one uppercase and special character');

// Validator.register('unique', function (value, requirement, attribute) { 
//     console.log(value, requirement, attribute)
//     return value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
// }, 'Password must contains atleast 8 characters with one uppercase and special character');

// Validator.register('exists', function (value, requirement, attribute) { 
//     console.log(value, requirement, attribute)
//     return value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
// }, 'Password must contains atleast 8 characters with one uppercase and special character');


const Validation = (data, rules, message = null) => {
    const validation = new Validator(data, rules);
    if (validation.fails()) {
        return { status: 0, message: _.values(validation.errors.errors)[0][0] } //first error
    }
    return { status: 1, message: 'Validation passed' }
}
export default Validation;