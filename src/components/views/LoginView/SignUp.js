import React from 'react';
import { Link } from "react-router-dom"


const SignUp = () => {
    return (
        <div class="vh-100 bg-image">
        <div class="mask d-flex align-items-center h-100 gradient-custom-3">
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
                        <label class="form-label" for="form3Example4cdg">Contact Number</label>
                        <input type="tel" id="form3Example4cdg" class="form-control form-control-lg" />
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
        </div>
     )
 }

export default SignUp;