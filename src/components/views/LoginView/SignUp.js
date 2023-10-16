import React, {useState} from 'react';
import { Link } from "react-router-dom"
import { PhoneInput } from 'react-international-phone';
import { PhoneNumberUtil } from 'google-libphonenumber';
import 'react-international-phone/style.css';


  

const SignUp = () => {

        const [phone, setPhone] = useState("");
        const phoneUtil = PhoneNumberUtil.getInstance();


        const isPhoneValid = (phone) => {
        try {
            return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
        } catch (error) {
            return false;
        }
        };

    return (
        <div class="vh-100 bg-image">
            <div class="container h-40">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-9 col-lg-7 col-xl-6">
                <div class="card rounded-3">
                    <div class="card-body p-4">
                    <h2 class="text-uppercase text-center mb-3"> Create an account</h2>
                    <form>
                        <div class="form-outline mb-4">
                        <label class="form-label" for="form3Example1cg">First Name</label>
                        <input type="text" id="form3Example1cg" class="form-control form-control-lg" required/>
                        </div>

                        <div class="form-outline mb-4">
                        <label class="form-label" for="form3Example1cg">Last Name</label>
                        <input type="text" id="form3Example1cg" class="form-control form-control-lg" required/>
                        
                        </div>

                        <div class="form-outline mb-4">
                            <label for="validationServerUsername" class="form-label">UofT email</label>
                                <div class="input-group has-validation">
                                <span class="input-group-text" id="inputGroupPrepend3">@</span>
                                <input type="text" class="form-control is-invalid" id="validationServerUsername" aria-describedby="inputGroupPrepend3 validationServerUsernameFeedback" required/>
                                <div id="validationServerUsernameFeedback" class="invalid-feedback">
                                    Please choose a valid email.
                                </div>
                             </div>
                        </div>

                        <div class="form-outline mb-4">
                        <label for="validationServer03" class="form-label">Password</label>
                        <input type="password" class="form-control is-invalid" id="validationServer03" aria-describedby="validationServer03Feedback" required/>
                        <div id="validationServer03Feedback" class="invalid-feedback">Please provide a valid password</div>
                        </div>

                        <div class="form-outline mb-4">
                        <label for="validationServer03" class="form-label">Confirm Password</label>
                        <input type="password" class="form-control is-invalid" id="validationServer03" aria-describedby="validationServer03Feedback" required/>
                        <div id="validationServer03Feedback" class="invalid-feedback">Passwords do not match</div>
                        
                        </div>

                        <div class="form-outline mb-4">
                        <label class="form-label style:{}" for="form3Example4cdg">Contact Number</label>
                        <div>
                            <PhoneInput
                                defaultCountry="ua"
                                value={phone}
                                onChange={(phone) => setPhone(phone)}
                            />

                            {!isPhoneValid(phone) && <div style={{ color: 'red' }}>Phone is not valid</div>}

                        </div>
                        </div>

                        <div class="d-flex justify-content-center">
                        <button type="button"
                            class="btn btn-success btn-block btn-lg gradient-custom-4 text-body">Register</button>
                        </div>

                        <p class="text-center text-muted mt-5 mb-0">Have already an account? <Link to={"/login"}><button class="btn btn-md text-center">Log In</button></Link></p>

                    </form>

                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
     )
 }

export default SignUp;