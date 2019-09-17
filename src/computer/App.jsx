import React from 'react'
import { Form, Input, Icon, Row, Col, InputNumber, Select, Button, message, Modal } from 'antd'
import axios from "axios"
import "./css/App.css"

const componentType = {
    FORM: 'FORM',
    LABEl: 'LABEl'
};
const { Option } = Select;


class Computer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            frequency: 1,
            visible: false
        }
    }

    FormItem = (children) => {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const {
            filedKey,
            label,
            childForm,
            formLayout,
            formStyle,
            labelStyle,
            options
        } = children;

        return (
            <Row key={filedKey} className="computer-form__data">
                <Col xs={6} sm={7} md={8} lg={9} xl={11} className={labelStyle}>
                    {label || null}
                </Col>
                <Col xs={18} sm={17} md={16} lg={15} xl={13}>
                    <Form.Item
                        className={formStyle}
                        {...formLayout}
                        key={filedKey}
                    >
                        {getFieldDecorator(filedKey, {
                            rules: options.rules,
                            initialValue: options.initialValue || null
                        })(
                            childForm
                        )}
                    </Form.Item>
                </Col>
            </Row>
        )
    }

    LabelText = (children = null, i) => {
        const { form } = this.props;
        const { getFieldDecorator } = form;

        let child = null;

        if (typeof children === "function") {
            child = this.props.form.getFieldValue(`Brand${i}`) === "戴尔" ? children() : null
        } else {
            child = children
        }

        if (child) {
            return (
                <Row key={child.filedKey + i} className="computer-form__data">
                    <Col xs={6} sm={7} md={8} lg={9} xl={11} className={child.labelStyle}>
                        {child.label || null}
                    </Col>
                    <Col xs={18} sm={17} md={16} lg={15} xl={13}>
                        <Form.Item
                            className={child.formStyle}
                            {...child.formLayout}
                            key={child.filedKey + i}
                        >
                            {getFieldDecorator(child.filedKey + i, {
                                rules: child.options.rules,
                                initialValue: child.options.initialValue || null
                            })(
                                child.childForm
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            )
        }
    }

    userNameENElement = () => {
        return (
            <Input
                prefix={<Icon type="user"
                style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="English name"
                style={{ width: 240 }}
            />
        )
    }

    userNameCNElement = () => {
        return (
            <Input
                prefix={<Icon type="user"
                    style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Chinese name"
                style={{ width: 240 }}
            />
        )
    }

    productNameElement = () => {
        return (
            <Select style={{ width: 240 }}>
                <Option value="台式">台式</Option>
                <Option value="笔记本">笔记本</Option>
            </Select>
        )
    }

    productQuantityElement = () => {
        return (
            <InputNumber
                min={1}
                onChange={this.productQuantityChange}
                style={{ width: 240 }}
            />
        )
    }

    departmentElement = () => {
        return (
            <Input
                prefix={<Icon type="idcard"
                    style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="attribution department"
                style={{ width: 240 }}
            />
        )
    }

    serialNumberElement = () => {
        return (
            <Input
                prefix={<Icon type="ordered-list"
                    style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="serial number"
                style={{ width: 240 }}
            />
        )
    }

    brandElement = () => {
        return (
            <Select style={{ width: 240 }}>
                <Option value="华为">华为</Option>
                <Option value="小米">小米</Option>
                <Option value="联想">联想</Option>
                <Option value="苹果">苹果</Option>
                <Option value="戴尔">戴尔</Option>
                <Option value="华硕">华硕</Option>
                <Option value="惠普">惠普</Option>
                <Option value="微软">微软</Option>
                <Option value="神舟">神舟</Option>
                <Option value="机械革命">机械革命</Option>
                <Option value="宏碁">宏碁</Option>
                <Option value="索尼">索尼</Option>
                <Option value="三星">三星</Option>
                <Option value="方正">方正</Option>
                <Option value="松下">松下</Option>
            </Select>
        )
    }

    modelNumberElement = () => {
        return (
            <Input
                placeholder="On the back of the machine"
                style={{ width: 240 }}
            />
        )
    }

    serviceCodeElement = () => {
        return (
            <Input
                placeholder="service Code"
                style={{ width: 240 }}
            />
        )
    }

    quickServiceCodeElement = () => {

        return {
            type: componentType.LABEl,
            label: '快速服务代码:',
            labelStyle: "computer-form__user",
            filedKey: 'E_Service',
            formStyle: "computer-form__user-input",
            options: {
                rules: [
                    { required: true, message: "请输入快速服务代码" },
                ],
            },
            childForm: (<Input
                placeholder="quick service code"
                style={{ width: 240 }}
            />)
        }
    }

    dataElement = (fromDataPropsArray) => {
        let data = [];
        for (let i = 1; i <= this.state.frequency; i++) {
            data.push(this.renderArray(fromDataPropsArray, i))
        }
        return data;
    }

    renderArray = (fromDataPropsArray, i) => {
        return fromDataPropsArray.map((itemProps) => {
            if (itemProps.type === componentType.LABEl) {
                return this.LabelText(itemProps, i);
            } else if (typeof itemProps === "function") {
                return this.LabelText(itemProps, i);
            }
        })
    }

    productQuantityChange = (e) => {
        this.setState({ frequency: e });
    }

    handleSubmit = e => {  //提交form表单
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.showModal(values);
            }
        });
    };

    usernameEnglishVerify = (rule, value, callback) => {
        const reg = /^\w+\.?\w+$/

        if (!reg.test(value)) {
            callback("英文名输入格式有误");
        } else {
            callback();
        }
    }

    usernameChineseVerify = (rule, value, callback) => {
        const reg = /^[\u4e00-\u9fa5]{2,10}$/

        if (!reg.test(value)) {
            callback("中文名输入格式有误");
        } else {
            callback();
        }
    }

    showModal = (values) => {
        let arr = []
        let title = null;
        for (let i in values) {
            if(i === "username_en"){
                title = "英文名"
            }
            if(i === "User_Chinesename"){
                title = "中文名"
            }
            if(i === "Attribution_Dept"){
                title = "归属部门"
            }
            if(i === "Amount"){
                title = "产品数量"
            }
            if(i.search("Brand") === 0){
                title = "品牌"
            }
            if(i.search("Product_Name") === 0){
                title = "产品类型"
            }
            if(i.search("Number_Pc") === 0){
                title = "机器编号"
            }
            if(i.search("xinghao") === 0){
                title = "型号"
            }
            if(i.search("Service_Tag") === 0){
                title = "服务编号"
            }
            if(i.search("E_Service") === 0){
                title = "快速服务代码"
            }
            arr.push(<p key={values[i]}>{title}---{values[i]}</p>)
        }

        this.setState({
            visible: true,
            data: arr,
            value: values
        });
    };

    handleOk = e => {

        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i].trim();
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

        this.state.value ? axios({
            url: "https://itzichan.otms.cn/Collect_employee_information/",
            method: 'post',
            data: this.state.value,
            headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-User": "?1",
                "Upgrade-Insecure-Requests": "1",
                "X-CSRFToken": getCookie("csrf_token")
            },
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }]
        }).then(res => {
            message.success('Submit successfully');
        })
        .catch(function (error) {
            message.success('Submit successfully');
        }) : message.success('数据未填写');

        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const usernameEnglish = {  //用户名英文名
            type: componentType.FORM,
            label: '英文名:',
            labelStyle: "computer-form__user",
            filedKey: 'username_en',
            formStyle: "computer-form__user-input",
            options: {
                rules: [
                    { required: true, message: "请输入英文名" },
                    { validator: this.usernameEnglishVerify }
                ],
            },
            childForm: this.userNameENElement()
        };

        const usernameChinese = {  //用户名中文名
            type: componentType.FORM,
            label: '中文名:',
            labelStyle: "computer-form__user",
            filedKey: 'User_Chinesename',
            formStyle: "computer-form__user-input",
            options: {
                rules: [
                    { required: true, message: "请输入中文名" },
                    { validator: this.usernameChineseVerify }
                ],
            },
            childForm: this.userNameCNElement()
        };

        const productQuantity = {  //产品数量
            type: componentType.FORM,
            label: '产品数量:',
            labelStyle: "computer-form__user",
            filedKey: 'Amount',
            formStyle: "computer-form__user-input",
            options: {
                rules: [
                    { required: true, message: "请输入产品数量" },
                ],
                initialValue: 1
            },
            childForm: this.productQuantityElement()
        };

        const department = {  //归属部门
            type: componentType.FORM,
            label: '归属部门:',
            labelStyle: "computer-form__user",
            filedKey: 'Attribution_Dept',
            formStyle: "computer-form__user-input",
            options: {
                rules: [
                    { required: true, message: "请输入归属部门" },
                ],
            },
            childForm: this.departmentElement()
        };

        const serialNumber = {  //机器编号
            type: componentType.LABEl,
            label: '机器编号:',
            labelStyle: "computer-form__user",
            filedKey: 'Number_Pc',
            formStyle: "computer-form__user-input",
            options: {
                rules: [
                    { required: true, message: "请输入机器编号" },
                ],
            },
            childForm: this.serialNumberElement()
        };

        const brand = {  //品牌
            type: componentType.LABEl,
            label: '品牌:',
            labelStyle: "computer-form__user",
            filedKey: 'Brand',
            formStyle: "computer-form__user-input",
            options: {
                rules: [
                    { required: true, message: "请输入品牌" },
                ],
                initialValue: ["华为"]
            },
            childForm: this.brandElement()
        };

        const productName = {  //产品类型
            type: componentType.LABEl,
            label: '产品类型:',
            labelStyle: "computer-form__user",
            filedKey: 'Product_Name',
            formStyle: "computer-form__user-input",
            options: {
                rules: [
                    { required: true, message: "请输入产品类型" },
                ],
                initialValue: ["笔记本"]
            },
            childForm: this.productNameElement()
        };

        const modelNumber = {  //型号
            type: componentType.LABEl,
            label: '型号:',
            labelStyle: "computer-form__user",
            filedKey: 'xinghao',
            formStyle: "computer-form__user-input",
            options: {
                rules: [
                    { required: true, message: "请输入型号" },
                ],
            },
            childForm: this.modelNumberElement()
        };

        const serviceCode = {  //服务编号
            type: componentType.LABEl,
            label: '服务编号:',
            labelStyle: "computer-form__user",
            filedKey: 'Service_Tag',
            formStyle: "computer-form__user-input",
            options: {
                rules: [
                    { required: true, message: "请输入服务编号" },
                ],
            },
            childForm: this.serviceCodeElement()
        };

        const fromDataPropsArray = [brand, productName, serialNumber, modelNumber, serviceCode, this.quickServiceCodeElement]

        const fromPropsArray = [usernameEnglish, usernameChinese, department, productQuantity];

        return (
            <Form onSubmit={this.handleSubmit} className="computer-form">
                <div className="computer-form__title">
                    <h1>员工IT资产信息收集</h1>
                </div>
                {
                    fromPropsArray.map((itemProps) => {
                        if (itemProps.type === componentType.FORM) {
                            return this.FormItem(itemProps);
                        }
                    })
                }
                {
                    this.dataElement(fromDataPropsArray)
                }
                <div className="computer-form__submit"><Button type="danger" htmlType="submit">submit</Button></div>
                <div>
                    <Modal
                        title="请检查表单信息是否输入正确? "
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        htmlType="submit"
                        onCancel={this.handleCancel}
                    >
                        {this.state.data ? this.state.data.map((currentValue,index,arr) => {
                            return(
                                currentValue
                            )
                        }): null}
                    </Modal>
                </div>
            </Form>
        )
    }
}

const ComputerForm = Form.create({ name: 'computer_form' })(Computer);

export default ComputerForm