import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback ,Card, CardImg,CardImgOverlay, CardTitle, CardBody, CardText} from 'reactstrap';
import { BrowserRouter, NavLink } from 'react-router-dom';
import '../App.css';
import { render } from 'react-dom';

class PatientDetailsComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patAadhar: '',
            allergies: '',
            weight: '',
            height: '',
            gender: '',
            bloodtype: '',
            age: '',
            location: '',
            treatmentsgone: '',
        };
        this.Bloodtype = this.Bloodtype.bind(this);
        this.Gender = this.Gender.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

    }

    //  contract = this.props.contract;
    //  accounts = this.props.accounts; 

    Bloodtype(bloodInput) {
        switch(bloodInput) {
            case "0" : return 'A';
            case "1" : return 'B';
            case "2" : return 'AB';
            case "3" : return 'O';
        }
    }

    Gender(genInput) {
        switch(genInput) {
            case "0" : return 'Male';
            case "1" : return 'Female'; 
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        })
    }

    async handleSubmit(event) {
        console.log("Current State" + JSON.stringify(this.state));
        event.preventDefault();
        const res = await this.props.contract.methods.patientAadhars(this.state.patAadhar).call();
        // var arr = '';
        // res.map(ms => {
        //     arr = arr.concat(ms,',')
        // })

        //console.log("fdsaf",arr);
        let bloodtypeLocal = this.Bloodtype(res.bloodType);
        let genderLocal = this.Gender(res.gender);
        this.setState({
            allergies: res.allergies,
            weight: res.weight,
            height: res.height,
            gender: genderLocal,
            bloodtype: bloodtypeLocal,
            age: res.age,
            location: res.location,
            patient_state: res.patient_state,
            //treatmentsgone: arr

        });
        console.log("Current State" + JSON.stringify(this.state));
        // console.log(res);

    }

    render() {
        return (
            <div className="container">

                <h2>Patient Details</h2>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup row>
                        <Label htmlFor="patAadhar" md={2}>Patient Aadhar</Label>
                        <Col md={10}>
                            <Input type="text" id="patAadhar" name="patAadhar" placeholder="Patient Aadhar No." value={this.state.patAadhar} onChange={this.handleInputChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col md={{ size: 12}}>
                            <Button type="submit" color="primary">
                                Get Data
                                    </Button>
                        </Col>
                    </FormGroup>
                </Form>
                <br />
                <br />
                <h2>Patient Details</h2>
                <Card >
                    <i className="fa fa-wheelchair fa-3x"></i>
                    <CardBody>
                        <CardTitle>Patient Aadhar : {this.state.patAadhar}</CardTitle>
                        <CardText><small>Height : {this.state.height}</small></CardText>
                        <CardText><small>Weight : {this.state.weight}</small></CardText>
                        <CardText><small>Bloodtype : {this.state.bloodtype}</small></CardText>
                        <CardText><small>Gender : {this.state.gender}</small></CardText>
                        <CardText><small>Location : {this.state.location}</small></CardText>
                        <CardText><small >treatments Undergone : {this.state.treatmentsgone}</small></CardText>
                    </CardBody>
                </Card>
                <br />
                <br />
                <br />
                <br />
            </div>
            

        )
    }
}

export default PatientDetailsComp;