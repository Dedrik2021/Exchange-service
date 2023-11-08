import { helpers } from '@vuelidate/validators';

export const supportedFileType = (value) => {
    if (!helpers.req(value)) return true

    const extension = value.split(".").pop()
    const allowedFormats = ['jpeg', 'jpg', 'png', 'svg']

    return allowedFormats.includes(extension)
}