const success = (message = "success", data = null, extra = null) => {
    let result = {
        status_code: 1,
        status_text: 'success',
        message
    }
    if (data != null) {
        result['data'] = data
    }
    if (extra != null) {
        Object.assign(result, extra)
    }
    return result;
}
const failed = (message = "failed") => {
    return {
        status_code: 0,
        status_text: 'failed',
        message
    }
}
const unverifiedEmail = (message = "Email address not verified") => {
    return {
        status_code: 2,
        status_text: 'unverfied email',
        message
    }
}
const unverifiedPhone = (message = "Phone not verified") => {
    return {
        status_code: 3,
        status_text: 'unverfied phone',
        message
    }
}
const unauth = () => {
    return {
        status_code: 401,
        status_text: 'Unauthorized',
        message: 'failed'
    }
}

const paginate = async (Model, page = 1, per_page = 10, condition = {}) => {
    let offset = parseInt(page) * parseInt(per_page) - parseInt(per_page);
    let total_data = await Model.count(condition)
    console.log({ offset, total_data })
    Object.assign(condition, { limit: parseInt(per_page), offset: offset });
    let data = await Model.findAll(condition)
    return {
        data,
        current_page: page,
        per_page,
        total_data,
        total_pages: Math.ceil(total_data / parseInt(per_page))
    }
}

export default {
    success,
    failed,
    unauth,
    paginate,
    unverifiedEmail,
    unverifiedPhone
}