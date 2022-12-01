import Ajv from 'ajv';
import { Plan, PricingOption, ReleaseType, PlatformsType } from '../../app/enums';


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
        'platforms-type': {
            validate: (value: any) => Object.values(PlatformsType).includes(value)
        },
        'release-plan': {
            validate: (value: any) => Object.values(Plan).includes(value)
        },
        'pricing-option': {
            validate: (value: any) => Object.values(PricingOption).includes(value)
        },
        'release-type': {
            validate: (value: any) => Object.values(ReleaseType).includes(value)
        },
        'rgb': {
            validate: (value: any) => {
                const color = parseInt(value);
                return color > 0 && color < 256;
            }
        },
        'page-type': {
            validate: (value: any) =>
                value === '' ||
                value === 'media' ||
                value === 'distribution'
        }
    }
});