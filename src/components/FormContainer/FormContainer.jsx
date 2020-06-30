import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Form, Icon } from 'semantic-ui-react';
import styles from './FormContainer.module.scss';

const moment = extendMoment(Moment);

const options = [
    { key: 'default', text: 'не выбран', value: 'default' },
    { key: 'female', text: 'Женский', value: 'Женский' },
    { key: 'male', text: 'Мужской', value: 'Мужской' }
]
const country = [
    { key: 'russia', text: 'Россия', value: 'Россия' },
    { key: 'ukraine', text: 'Украина', value: 'Украина' },
    { key: 'england', text: 'Англия', value: 'Англия' },
    { key: 'france', text: 'Франция', value: 'Франция' },
    { key: 'Italy', text: 'Италия', value: 'Италия' },
    { key: 'germany', text: 'Германия', value: 'Германия' }
]
const documents = [
    { key: 'rf', text: 'Паспорт РФ', value: 'Паспорт РФ' },
    { key: 'ussr', text: 'Паспорт формы СССР', value: 'Паспорт формы СССР' },
    { key: 'visa', text: 'Заграничный паспорт', value: 'Заграничный паспорт' },
    { key: 'nation', text: 'Иностранный документ', value: 'Иностранный документ' },
]

const tariffs = [
    { key: 'default', text: 'не выбран', value: 'default' },
    { key: 'basic', text: 'Базовый', value: 'Базовый' },
    { key: 'standard', text: 'Стандартный', value: 'Стандартный' },
    { key: 'premium', text: 'Премиум', value: 'Премиум' }
]

const initialState = {
    firstName: '',
    lastName: '',
    surName: '',
    sex: '',
    birthdayDate: '',
    citizen: 'Россия',
    documentType: 'Паспорт РФ',
    documentNumber: '',
    tariff: '',
    email: '',
    phoneNumber: ''
};

const initialStateValidation = {
    firstNameValidation: false,
    lastNameValidation: false,
    surNameValidation: false,
    sexValidation: false,
    birthdayDateValidation: false,
    citizenValidation: false,
    documentTypeValidation: false,
    documentNumberValidation: false,
    tariffValidation: false
};

function underAgeValidate(birthday) {
    const current = moment(new Date(Date.now())).format('l').split('/')
    const [day, month] = [current[1], current[0]]
    const startDate = moment('1900-01-01', 'YYYY-MM-DD')
    const endDate = moment(`2002-${month}-${day}`, 'YYYY-MM-DD')
    return moment(birthday).isAfter(startDate) && moment(birthday).isBefore(endDate)

}


export default function ({ setPassengersCount, passengersCount, number, deletedCount, setDeletedCount, handleSubmitForms, jsonPassengers, setJsonPassengers }) {
    const [{ firstName, lastName, surName, sex, birthdayDate, citizen, documentType, documentNumber, tariff, email, phoneNumber },
        setState] = useState(initialState)
    const validator = { firstName, lastName, surName, sex, birthdayDate, citizen, documentType, documentNumber, tariff }
    const [{ citizenValidation, documentTypeValidation, documentNumberValidation, tariffValidation },] = useState(initialStateValidation)
    const [errorMessage, setErrorMessage] = useState({})
    const [disabledForm, setDisabledForm] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const passenger = {
        id: number,
        firstName,
        lastName,
        surName,
        sex,
        birthdayDate,
        citizen,
        documentType,
        documentNumber,
        tariff,
        email,
        phoneNumber
    }

    const mount = useRef(false)

    const disabledButton = useMemo(() => {
        if (!mount.current) return true
        let status = false
        for (let key in errorMessage) {
            if (errorMessage[key] && !(key === 'email' || key === 'phoneNumber')) {
                status = true
            }
        }
        for (let item in passenger) {
            if (passenger[item] === '' && !(item === 'email' || item === 'phoneNumber')) {
                status = true
            }
        }

        return status
    }, [errorMessage])



    useEffect(() => {
        mount.current = true
    }, [])


    const clearState = () => {
        setState({ ...initialState });
    };

    const handleAddPassenger = () => {
        if (!disabledButton) {
            setJsonPassengers([...jsonPassengers, passenger])
            setPassengersCount(passengersCount + 1)
            setDisabled(true)
        }
    }

    const handleDeletePassenger = () => {
        setJsonPassengers([...jsonPassengers.filter(item => item.id !== number)])
        clearState()
        setDeletedCount(deletedCount + 1)
        if (passengersCount - deletedCount > 1) {
            clearState()
            setDisabledForm(true)
        }
    }

    const onChange = e => {
        const { name, value } = e.target;
        setState(prevState => ({ ...prevState, [name]: value }));

        checkValidation({ [name]: value })
        if (value === '') {
            if (name === 'email' || name === 'phoneNumber') {
                setErrorMessage(prevState => ({ ...prevState, [name]: null }))
            }
            else setErrorMessage(prevState => ({ ...prevState, [name]: 'Обязательное поле' }))
        }
    };

    const checkValidation = (obj = validator) => {
        let status = true
        for (let key in obj) {
            switch (key) {
                case 'firstName':
                case 'lastName':
                case 'surName': {
                    if (obj[key].match(/[0-9]/)) {
                        setErrorMessage(prevState => ({ ...prevState, [key]: 'Недопустимые символы' }))
                        status = false
                    } else {
                        setErrorMessage(prevState => ({ ...prevState, [key]: null }))
                    }
                    break
                }
                case 'birthdayDate': {
                    if (!underAgeValidate(obj[key])) {
                        setErrorMessage(prevState => ({ ...prevState, [key]: 'Недопустимая дата' }))
                        status = false
                    } else {
                        setErrorMessage(prevState => ({ ...prevState, [key]: null }))
                    }
                    break
                }
                case 'sex': {
                    if (obj[key] === 'default') {
                        setErrorMessage(prevState => ({ ...prevState, [key]: 'Обязательное поле' }))
                        status = false
                    } else {
                        setErrorMessage(prevState => ({ ...prevState, [key]: null }))
                    }
                    break
                }
                case 'tariff': {
                    if (obj[key] === 'default') {
                        setErrorMessage(prevState => ({ ...prevState, [key]: 'Обязательное поле' }))
                        status = false
                    } else {
                        setErrorMessage(prevState => ({ ...prevState, [key]: null }))
                    }
                    break
                }
                case 'documentNumber': {
                    if (obj[key].length < 10) {
                        setErrorMessage(prevState => ({ ...prevState, [key]: 'Недопустимый формат' }))
                        status = false
                    } else {
                        setErrorMessage(prevState => ({ ...prevState, [key]: null }))
                    }
                    break
                }
                case 'phoneNumber': {
                    const pattern = /^((\+7|7|8)+([0-9]){10})$/
                    if (!pattern.test(obj[key])) {
                        setErrorMessage(prevState => ({ ...prevState, [key]: 'Недопустимый формат номера (+7-999-999-9999)' }))
                        status = false
                    } else {
                        setErrorMessage(prevState => ({ ...prevState, [key]: null }))
                    }
                    break
                }
                case 'email': {
                    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    if (!pattern.test(obj[key])) {
                        setErrorMessage(prevState => ({ ...prevState, [key]: 'Недопустимый формат' }))
                        status = false
                    } else {
                        setErrorMessage(prevState => ({ ...prevState, [key]: null }))
                    }
                    break
                }
            }
        }
        return status
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (checkValidation()) {
            handleSubmitForms(passenger)
        }
    };

    return <main style={{ display: disabledForm ? 'none' : null }}>
        <header className={styles.header}>
            <h2 style={{ borderBottom: disabled ? '1px solid #000' : null }}>Пассажир №{number}</h2>
            <div onClick={handleDeletePassenger}>
                <Icon name='minus square' size='big' color='red' />
                <span className={styles.deleteButton}>Удалить пассажира</span>
            </div>
        </header>
        <Form style={{ display: disabled ? 'none' : null }}>
            <Form.Group widths='equal'>
                <Form.Field required>
                    <label>Имя</label>
                    <Form.Input
                        required={true}
                        name="firstName"
                        onChange={onChange}
                        value={firstName}
                        error={errorMessage.firstName ? true : false} />
                    <div className={styles.error}> {errorMessage.firstName ? errorMessage.firstName : null}</div>
                </Form.Field>
                <Form.Field required>
                    <label>Фамилия</label>
                    <Form.Input
                        required={true}
                        name="lastName"
                        onChange={onChange}
                        value={lastName}
                        error={errorMessage.lastName ? true : false} />
                    <div className={styles.error}> {errorMessage.lastName ? errorMessage.lastName : null}</div>
                </Form.Field>
                <Form.Field required>
                    <label> <span className={styles.label}> Отчество (обязательно, при наличии)</span> </label>
                    <Form.Input
                        required={true}
                        name="surName"
                        onChange={onChange}
                        value={surName}
                        error={errorMessage.surName ? true : false} />
                    <div className={styles.error}> {errorMessage.surName ? errorMessage.surName : null}</div>
                </Form.Field>
            </Form.Group>


            <Form.Group widths='equal'>
                <Form.Field
                    name="sex"
                    required={true}
                    default='default'
                    label='Пол'
                    control='select'
                    value={sex}
                    onChange={onChange}
                    error={errorMessage.sex ? true : false}>
                    {options.map(item => <option key={item.key} value={item.value}>{item.text}</option>)}
                </Form.Field>
                <Form.Field required>
                    <label>Дата рождения</label>
                    <Form.Input
                        required={true}
                        name="birthdayDate"
                        onChange={onChange}
                        value={birthdayDate}
                        type='date'
                        error={errorMessage.birthdayDate} />
                </Form.Field>
                <Form.Field
                    name="citizen"
                    required={true}
                    label='Гражданство'
                    control='select'
                    value={citizen}
                    onChange={onChange}
                    error={citizenValidation}>
                    {country.map(item => <option key={item.key} value={item.value}>{item.text}</option>)}
                </Form.Field>
            </Form.Group>

            <Form.Group widths='equal'>
                <Form.Field required name="documentType" onChange={onChange} label='Тип документа' value={documentType} control='select' error={documentTypeValidation}>
                    {documents.map(item => <option key={item.key} value={item.value}>{item.text}</option>)}
                </Form.Field>
                <Form.Field required>
                    <label><span className={styles.label}>Номер документа</span></label>
                    <Form.Input required={true} name="documentNumber" onChange={onChange} value={documentNumber} type='number' default='' error={documentNumberValidation} />
                    <div className={styles.error}>{errorMessage.documentNumber ? errorMessage.documentNumber : null}</div>
                </Form.Field>
                <Form.Field required name="tariff"
                    onChange={onChange} label='Тариф' value={tariff} control='select' error={tariffValidation}>
                    {tariffs.map(item => <option key={item.key} value={item.value}>{item.text}</option>)}
                </Form.Field>
            </Form.Group>
            <div>

            </div>
            <div className={styles.subscribe}>
                <Form.Field>
                    <div className={styles.formField}>
                        <input type="checkbox" name="requiredBox" checked={true} readOnly />
                        <label className={styles.bold} htmlFor="requiredBox">
                            Согласен на получение оповещений в случаях чрезвычайных ситуаций на железнодорожном транспорте
                        </label>
                    </div>
                </Form.Field>
                <span className={styles.mgt20}>
                    На период распространения коронавирусной инфекции ОАО "РЖД" просит пассажиров в обязательном порядке
                    указывать контактный номер телефона или адрес электронной почты для оповещения о возможных изменениях
                    расписания и маршрутов поездов. Для других целей эти данные использоваться не будут.
                </span>
                <div className={styles.mgt20}>
                    <Form.Group>
                        <Form.Field >
                            <label>Телефон пассажира</label>
                            <Form.Input
                                required={true}
                                name="phoneNumber"
                                onChange={onChange}
                                value={phoneNumber}
                                type="tel"
                                error={errorMessage.phoneNumber ? true : false}
                                placeholder="+7-999-999-9999"
                            />

                            <div className={styles.error}> {errorMessage.phoneNumber ? errorMessage.phoneNumber : null}</div>
                        </Form.Field>
                        <Form.Field >
                            <label>E-mail пассажира</label>
                            <Form.Input
                                required={true}
                                name="email"
                                value={email}
                                onChange={onChange}
                                error={errorMessage.email ? true : false}
                                type="email" />
                            <div className={styles.error}>{errorMessage.email ? errorMessage.email : null}</div>
                        </Form.Field>
                    </Form.Group>
                </div>
            </div>
            <Form.Field>
                <div className={styles.formField}>
                    <input type="checkbox" />
                    <label className={styles.bold} htmlFor="">
                        Указать номер бонусной, электронной, дорожной карты, делового проездного или промокода'
                </label>
                </div>
            </Form.Field>
        </Form>
        <footer className={styles.footer} style={{ display: disabled ? 'none' : null }}>
            {passengersCount - deletedCount === number
                ? <>
                    <div onClick={handleAddPassenger}>
                        <Icon name='plus square' size='big' color='red' />
                        <span className={styles.deleteButton}>Добавить пассажира</span>
                    </div>
                    <button type='submit' disabled={disabledButton} onClick={handleSubmit}>Submit</button></>
                : null}
        </footer>
    </main >
}