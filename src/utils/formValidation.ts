let createdPassword: string;

export default function formValidationHandler(
    CLEAR_INPUT_FIELDS: boolean,
    form?: string,
    field?: string, 
    value?: string,
    submitEvent?: boolean,
) {
    const cyrillic = 'А-ЯЁа-яё';
    const latin = 'A-Za-z';
    const caseBlankSpace = '(required)';
    const caseNotString = 'must be a string';

    const validate = (valid: boolean, verdict?: string, caseDefault?: boolean) => 
        caseDefault === true ? {verdict} : (valid === true ? {valid: true} : {valid: false, verdict});
  
    if (CLEAR_INPUT_FIELDS) {
        return validate(true);
    } else {
            if (typeof value !== 'string') {
                return validate(false, `${field} ${caseNotString}.`);
            }
            switch (form) {
                case 'signup': {
                    switch (field) {
                        case 'email': {
                            if (value.trim().length === 0) {
                                return validate(false, caseBlankSpace);
                            }
                            const parts = value.split('@');
                            if (parts.length !== 2) {
                                return validate(false, `Email must contain @ symbol`);
                            }
                            const [local, domain] = parts;
                            if (!/^[A-Za-z0-9_.-]+$/.test(local)) {
                                return validate(false, `Email username can only contain letters, numbers, - and _`);
                            }
                            if (!domain) {
                                return validate(false, 'Specify domain and TLD');
                            }
                            if (!domain.includes('.')) {
                                return validate(false, 'Add TLD and separate it by .');
                            }
                            const [beforeDot, afterDot] = domain.split('.', 2);
                            if (!/[A-Za-z]$/.test(beforeDot)) {
                                return validate(false, 'Domain name must contain letters');
                            }
                            if (!/^[A-Za-z0-9.-]+$/.test(domain)) {
                                return validate(false, 'Only letters, numbers, - and _ are allowed in domain');
                            }
                            if (!/^[A-Za-z]{2,}/.test(afterDot)) {
                                return validate(false, 'TLD must contain at least 2 letters (e.g. ".com")');
                            }
                            return validate(true);
                        } 
                        case 'login': {
                            if (value.length === 0) {
                                return validate(true)
                            }
                            if (!/[A-Za-z]/.test(value)) {
                                return validate(false, 'Must contain at least one letter');
                            }
                            if (value.length < 3 || value.length >= 20) {
                                return validate(false, `Length must be between 3 and 20 figures`);
                            }
                            if (/\s/.test(value)) {
                                return validate(false, `Cannot contain spaces (use - or _)`);
                            }
                            if (!/^[A-Za-z0-9_-]+$/.test(value)) {
                                return validate(false, 'Only allowed to contain letters, numbers, dash, and underscore');
                            }
                            return validate(true);
                        } 
                        case 'first_name':
                        case 'second_name': {
                            if (value.trim().length === 0) {
                                return validate(false, caseBlankSpace);
                            }
                
                            const lat = new RegExp(`^[A-Z][${latin}-]*$`);
                            const cyr = new RegExp(`^[А-ЯЁ][${cyrillic}-]*$`);
                            if (!lat.test(value) && !cyr.test(value)) {
                                return validate(false, 'First letter must be capital');
                            }
                            return validate(true);
                        } 
                        case 'password': {
                            createdPassword = value.trim();
                
                            if (value.trim().length === 0) {
                                return validate(false, caseBlankSpace);
                            }
                            if (value.length < 8 || value.length > 40) {
                                return validate(false, 'Length must be between 8 and 40 figures');
                            }
                            if (!/[A-ZА-ЯЁ]/.test(value)) {
                                return validate(false, 'Must contain at least one capital letter');
                            }
                            if (!/[0-9]/.test(value)) {
                                return validate(false, 'Must contain at leat one number');
                            }
                            return validate(true);
                        } 
                        case 'password-rep': {
                            if (value.trim().length === 0) {
                                return validate(false, caseBlankSpace);
                            }
                            if (value !== createdPassword) {
                                return validate(false, 'Passwords do not match');
                            }
                            return validate(true);
                        }
                        // @ts-ignore
                        case 'phone': {
                            if (/[A-Za-z]/.test(value)) {
                                return validate(false, 'Must contian only numbers');
                            }
                        }
                        case 'phone': {
                            if (value.trim().length === 0) {
                                return validate(false, caseBlankSpace);
                            }
                            if (!value.includes("+")) {
                                return validate(false, 'Must start with "+"');
                            }
                            // if (!/[0-9+]/.test(value)) {
                            //     return validate(false, 'Must contian only numbers.');
                            // }
                            if (/[A-Za-z]/.test(value)) {
                                return validate(false, 'Must contian only numbers');
                            }
                            const digits = value.startsWith('+') ? value.length - 1 : value.length;
                            if (digits < 10 || digits > 15) {
                                return validate(false, 'Phone number must be from 10 to 15 numbers');
                            }
                            return validate(true);
                        }
                        default: {
                            return validate(false,'Unknown input field!',true);
                        }
                    }
                }
                case 'login': {
                    switch (field) {
                        case 'login': {
                            if (value.trim().length === 0 && submitEvent) {
                                return validate(false, caseBlankSpace);
                            } else if (value.trim().length === 0) {
                                return validate(true)
                            }
                            return validate(true);
                        }
                        case 'password': {
                            if (value.trim().length === 0 && submitEvent) {
                                return validate(false, caseBlankSpace);
                            } else if (value.trim().length === 0) {
                                return validate(true)
                            }
                            return validate(true);
                        }
                        default: {
                            return validate(false, 'Unknown input field!',true);
                        }
                    }
                }
                default: {
                    return validate(false, 'Unknown input field!',true);
                }
            }
    }
}

