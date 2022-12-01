import Ajv from 'ajv';


export const ajv = new Ajv({
    formats: {
        'date': {
            validate: (value: any) => {
                const date = new Date(value);
                return !isNaN(date.getTime());
            }
        },
        'non-empty-string': {
            validate: (value: any) => !!value
        },
        'boolean-string': {
            validate: (value: any) => value === 'true' || value === 'false'
        },
        'rgb': {
            validate: (value: any) => {
                const color = parseInt(value);
                return color > 0 && color < 256;
            }
        },
    }
});