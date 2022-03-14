import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback } from 'reactstrap';
import '../App.css';
import { render } from 'react-dom';

class TreatmentComp extends Component{
    constructor(props){
        super(props);
        this.state={patAadhar : 0, 
                    symptoms : '', 
                    medications : '',
                    treatcount : 0,
                    procedure : '',
                    description : '',
                    prescription : '',
                    treatId : 0,
                    patstate : 'Active',
                    docaccount : ''
                };
        this.handleSubmitadd = this.handleSubmitadd.bind(this);
        this.handleSubmitmod = this.handleSubmitmod.bind(this);
        this.handleSubmitsenddoc = this.handleSubmitsenddoc.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    
    }
    
    handleInputChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name] : value
        })
    }

    async handleSubmitadd(event){
        console.log("Current State" + JSON.stringify(this.state));
        event.preventDefault();
        const res = await this.props.contract.methods.addTreatment(localStorage.getItem('myAadhar'), this.state.patAadhar).send({from: this.props.accounts,gas : 1000000});
        const treatcount = await this.props.contract.methods.treatmentCount().call();
        this.setState({
             treatcount : treatcount
         })
         console.log(this.state.treatcount);

        
    }
    async handleSubmitsenddoc(event){
        event.preventDefault();
     

        const res = await this.props.contract.methods.setDoc(this.state.treatId,this.state.docaccount).send({from: this.props.accounts[0],gas : 1000000});
        console.log(res);
        }

    async handleSubmitmod(event){
        event.preventDefault();
        var patientstate = 0;
        if(this.state.patstate == 'Recovered'){
            patientstate = 1;
        }
        else{
            patientstate = 2;
        }
        console.log("Current State" + JSON.stringify(this.state));
        let resi = await this.props.contract.methods.dotreatment(this.state.treatId,this.state.procedure,this.state.description,this.state.prescription,patientstate).send({from: this.props.accounts[0],gas : 1000000});
        console.log(resi);
    }

    render(){
        return(
            <div className="container">
                
                    <h2>Add Treatment</h2>
                
                <Form onSubmit={this.handleSubmitadd}>
                            <FormGroup row>
                                <Label htmlFor="patAadhar" md={2}>Patient Aadhar</Label>
                                <Col md={10}>
                                    <Input type="number" id="patAadhar" name="patAadhar" placeholder="Patient Account Address" value={this.state.patAadhar} onChange={this.handleInputChange}/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={{size:8}}>
                                    <Button type="submit" color="primary">
                                        Add Treatment
                                    </Button>
                                </Col>
                                <Col md={{size:2}}>
                                <Button color="success">{this.state.treatcount}</Button>
                                </Col>
                            </FormGroup>

                            
                        </Form>
                        <br/>
                        <br/>
                        <h2>Do Treatment</h2>
                        <Form onSubmit={this.handleSubmitmod}>
                            <FormGroup row>
                                <Label htmlFor="treatId" md={2}>Treatment Id</Label>
                                <Col md={10}>
                                    <Input type="tel" id="treatId" name="treatId" placeholder="Treatment Id" value={this.state.treatId} onChange={this.handleInputChange}/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="patstate" md={2}>Patient State</Label>
                                <Col md={4}>
                                    <Input type="select" name="patstate" value={this.state.patstate} onChange={this.handleInputChange}>
                                    <option>Active</option>
                                    <option>Recovered</option>
                                    <option>Deceased</option>
                                    </Input>
                                </Col>
                            </FormGroup>
                            
                            <FormGroup row>
                                <Label htmlFor="procedure" md={2}>Procedure</Label>
                                <Col md={10}>
                                    <Input type="text" id="procedure" name="procedure" placeholder="Procedure" value={this.state.procedure} onChange={this.handleInputChange}/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="description" md={2}>Description</Label>
                                <Col md={10}>
                                    <Input type="text" id="description" name="description" placeholder="Description" value={this.state.description} onChange={this.handleInputChange} />    
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="prescription" md={2}>Prescription</Label>
                                <Col md={10}>
                                    <Input type="text" id="prescription" name="prescription" placeholder="Prescription" value={this.state.prescription} onChange={this.handleInputChange} />    
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={{size:10, offset:2}}>
                                    <Button type="submit" color="primary">
                                        Do Treatment
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>
                        <br/>
                        <br/>
                        <h2>Send Treatment</h2>
                        <Form onSubmit={this.handleSubmitsenddoc}>
                        <FormGroup row>
                                <Label htmlFor="treatId" md={2}>Treatment Id</Label>
                                <Col md={10}>
                                    <Input type="tel" id="treatId" name="treatId" placeholder="Treatment Id" value={this.state.treatId} onChange={this.handleInputChange}/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor="docaccount" md={2}>Doctor Account</Label>
                                <Col md={10}>
                                    <Input type="text" id="docaccount" name="docaccount" placeholder="Doctor Account Address" value={this.state.docaccount} onChange={this.handleInputChange}/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={{size:10, offset:2}}>
                                    <Button type="submit" color="primary">
                                        Send Treatment
                                    </Button>
                                </Col>
                                
                            </FormGroup>

                            
                        </Form>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                </div>
       
        )
        }        
}

export default TreatmentComp;