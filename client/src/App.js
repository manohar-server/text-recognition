import React, {Component} from 'react';
import './App.css';
import "react-progress-2/main.css";
import Progress from "react-progress-2";
import {
    ButtonGroup,
    Button,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
} from 'reactstrap';
import restClient from "./restClient";
import MetadataListView from "./MetadataListView";

const pageSize = 10;
const initMetaDataPaged = {
    content: [],
    totalSize: 0,
    page: 0
};

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            file: "",
            title: "",
            details: "",
            error: "",
            metaDataPaged: initMetaDataPaged,
            modalMessage: "",
            modal: false,
            blocking: false,
	    model : '',
	    year: '',
	    raw : '',
	    modelYear: '',
        }
    }

    componentDidMount() {
        //this.fetchMetadata(0, pageSize);
    }

    setStateAsync = (state) => {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    };

    toggleErrorAsync = async (error) => await this.toggleModalAsync(error);

    toggleModalAsync = async (message) => {
        await this.setStateAsync((state) => ({
            blocking: !state.blocking,
            modal: !state.modal,
            modalMessage: state.modal ? "" : message
        }));
    };

    //////////////////////// operations on test data with rest client //////////////////////////////
    fetchMetadata = async (page, sizePerPage, sortOrder) => {
        try {
            const sort = sortOrder || "asc";
            const response = await restClient.fetchAll(page, pageSize, sort);
            const metaDataPaged = {};
            metaDataPaged.content = response.content;
            metaDataPaged.totalSize = response.totalElements;
            metaDataPaged.page = page + 1;// rest api pages are 0-indexed while this component is 1-based indexed
            metaDataPaged.sizePerPage = sizePerPage;
            metaDataPaged.sortOrder = sort;
            await this.setStateAsync({metaDataPaged: metaDataPaged});
            return metaDataPaged;
        } catch (error) {
            await this.toggleErrorAsync("Cannot fetch tests");
        }
    };

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'file' ? event.target.files[0] : target.value;
        const name = target.name;
	if(target.type === 'file'){
		this.setState({model : '',
            year: '',
            raw : '',
            modelYear: ''});
	}
        this.setState({
            [name]: value, error: ""
        });
    };

    onUpload = async () => {
	Progress.show();
        try {
            const result = await restClient.uploadFile(this.state.file, this.state.title, this.state.details);
	    console.log(result);
	    this.setState({model: result.model, year: result.year, raw: result.raw, modelYear: result.size});
	    Progress.hide();
        } catch (e) {
	    Progress.hide();
            await this.toggleErrorAsync(e.message);
            return;
        }
        //await this.fetchMetadata(0, pageSize);
    }
    getMetadataColumns = () => {
        const keysArr = this.state.metaDataPaged.content.map(e => Object.keys(e));
        const keys = keysArr.length > 0 ? keysArr[0] : [];
        const headerParams = keys.map(k => {
            return {fieldName: k, columnName: k};
        });
        if (headerParams.length > 0) {
            // key attribute is required on one column
            headerParams[0].isKey = true;
        }
        return headerParams;
    };


    render() {
        return (
            <div className="App">
		<Progress.Component/>
                <Container>
                    <Row>
                        <Col>
                            <h6>Browse and Upload File to Extract Text</h6>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup row>
                                <Label for="file" sm={4}></Label>
                                <Col sm={8}>
                                    <Input type="file" name="file" id="file"
                               Input       placeholder="Select a file for upload"
                                           onChange={this.handleInputChange}
                                           valid={true}/>
                                </Col>
                            </FormGroup>                           
                        </Col>

                    </Row>
                    <Row>
                        <Col>
                            <ButtonGroup>
                                <Button
                                    disabled={this.state.file === ""}
                                    color="primary" size="md"
                                    onClick={this.onUpload}>Upload</Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row>
                        <hr className={"divider"}/>
                    </Row>
			<Row>
<Col>
	<FormGroup row>
                                <Label sm={2}>ModelYear</Label>
                                <Col sm={10}>
                                   <label>{this.state.modelYear}</label>
                                </Col>
                            </FormGroup>

                        <FormGroup row>
                                <Label sm={2}>Model</Label>
                                <Col sm={10}>
                                   <label>{this.state.model}</label>
                                </Col>
                            </FormGroup>
<FormGroup row>
                                <Label sm={2}>Year</Label>
                                <Col sm={10}>
                                    <label>{this.state.year}</label>
                                </Col>
                            </FormGroup>
<FormGroup row>
                                <Label sm={2}>Raw Text</Label>
                                <Col sm={10}>
                                    <label>{this.state.raw}</label>
                                </Col>
                            </FormGroup>
</Col>
                    </Row>
                    
                </Container>


                {/*Waiting modal*/}
                <Modal isOpen={this.state.blocking} toggle={() => false}
                       className={this.props.className}>
                    <ModalBody>
                        Loading...
                    </ModalBody>
                </Modal>


                {/*Error modal*/}
                <Modal isOpen={this.state.modal} className={this.props.className}>
                    <ModalHeader>{/*Error*/}</ModalHeader>
                    <ModalBody>
                        {this.state.modalMessage}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleErrorAsync}>OK</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default App;
