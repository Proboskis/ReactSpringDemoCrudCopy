import {useState, useEffect} from 'react';
import {deleteStudent, getAllStudents} from "./Client";
import {Avatar, Badge, Breadcrumb, Button, Empty, Layout, Menu, Spin, Table, Tag, Radio, Popconfirm} from 'antd';
import {
    DesktopOutlined,
    FileOutlined, LoadingOutlined,
    PieChartOutlined, PlusOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import StudentDrawerForm from "./StudentDrawerForm";

import './App.css';
import {successNotification, errorNotification} from "./Notification";

const { Header, Content, Footer, Sider } = Layout;
const TheAvatar = ({name}) => {
    let trim = name.trim();
    if (trim.length === 0) {
        return <Avatar icon={<UserOutlined />} />
    }
    const split = trim.split(" ");
    if (split.length === 1) {
        return <Avatar>{name.charAt(0)}</Avatar>
    }
    return <Avatar>{`${name.charAt(0)}${name.charAt(name.length - 1)}`}</Avatar>
}

const removeStudent = (studentId, callback) => {
    deleteStudent(studentId).then(() => {
        successNotification("Student deleted", `Student with the id of ${studentId} was deleted successfully.`);
        callback();
    }).catch(err => {
        console.log(err);
        err.response.json().then(res => {
            console.log(res);
            errorNotification(
                "There was an issue",
                `${res.message} [${res.status}] [${res.error}]`
            )
        });
    })
}

const columns = fetchStudents => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text, student) => <TheAvatar name={student.name} />
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (text, student) =>
            <Radio.Group>
                <Popconfirm
                    placement="topRight"
                    title={`Are you sure you want to delete student named ${student.name} with the id of ${student.id}`}
                    onConfirm={() => removeStudent(student.id, fetchStudents)}
                    okText="Yes"
                    cancelText="No">
                    <Radio.Button value="small">Delete</Radio.Button>
                </Popconfirm>
                <Radio.Button value="small">Edit</Radio.Button>
            </Radio.Group>
    }
];

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
);

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('Option 1', '1', <PieChartOutlined />),
    getItem('Option 2', '2', <DesktopOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined />),
];

function App() {
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    const fetchStudents = () => getAllStudents().then(res => res.json()).then(data => {
        // console.log(data);
        setStudents(data);
    }).catch(err => {
        console.log(err.response);
        err.response.json().then(res => {
            console.log(res);
            errorNotification("There was an issue", `${res.message} [${res.status}] [${res.error}]`);
        });
    }).finally(() => setFetching(false));

    useEffect(() => {
        // console.log("component is mounted");
        fetchStudents();
    }, []);

    const  renderStudents = () => {
        if (fetching) {
            return <Spin indicator={antIcon} />
        }
        if (students.length <= 0) {
            return <>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                    Add New Student
                </Button>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                />
                <Empty/>
            </>
        }
        return <>
            <StudentDrawerForm setShowDrawer={setShowDrawer} showDrawer={showDrawer} fetchStudents={fetchStudents}></StudentDrawerForm>
            <Table dataSource={students}
                  columns={columns(fetchStudents)}
                  bordered
                  title={() =>
                      <>
                          <Button type="primary" shape="round" icon={<PlusOutlined />} size="small" onClick={() => setShowDrawer(!showDrawer)}>
                              Add New Student
                          </Button>
                          <Tag style={{marginLeft: '1rem'}}>Number of students</Tag>
                          <Badge
                              className="site-badge-count-109"
                              count={students.length}
                              style={{ backgroundColor: '#52c41a', marginLeft: '1rem', marginBottom: '0.2rem' }}
                          />
                      </>
                  }
                  pagination={{ pageSize: 50 }}
                  scroll={{ y: 500 }}
                  rowKey={(student) => student.id}
            />
        </>
    }

    return <Layout
        style={{
            minHeight: '100vh',
        }}
    >
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout className="site-layout">
            <Header
                className="site-layout-background"
                style={{
                    padding: 0,
                }}
            />
            <Content
                style={{
                    margin: '0 16px',
                }}
            >
                <Breadcrumb
                    style={{
                        margin: '16px 0',
                    }}
                >
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        minHeight: 360,
                    }}
                >
                    {renderStudents()}
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                By Proboskis
            </Footer>
        </Layout>
    </Layout>
}

export default App;
