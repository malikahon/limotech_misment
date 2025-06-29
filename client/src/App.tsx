import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Space,
  message,
  Popconfirm,
  ConfigProvider,
  Tooltip,
  Row,
  Col
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';
import { theme } from 'antd';

const App = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get('http://localhost:3000/api/fleet');
    setData(res.data);
  };

  const showModal = (item = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
    if (item) {
      form.setFieldsValue({
        ...item.fleet,
        productionDate: dayjs(item.fleet.productionDate, 'DD/MM/YYYY HH:mm')
      });
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const onFinish = async (values) => {
    const payload = {
      ...values,
      productionDate: dayjs(values.productionDate).format('DD/MM/YYYY HH:mm')
    };

    if (editingItem) {
      await axios.put(`http://localhost:3000/api/fleet/${editingItem.id}`, { fleet: payload });
      message.info('Fleet item updated successfully');
    } else {
      await axios.post('http://localhost:3000/api/fleet', payload);
      message.success('Fleet item added successfully');
    }
    fetchData();
    handleCancel();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/api/fleet/${id}`);
    message.error('Fleet item deleted');
    fetchData();
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="container" style={{ padding: 24, backgroundColor: '#141414', minHeight: '100vh', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ color: '#fff' }}>Fleet List</h2>
          <Button type="primary" onClick={() => showModal()}>+ Add Fleet</Button>
        </div>

        <Row gutter={[16, 16]}>
          {data.map((item, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <Card
                hoverable
                title={<span style={{ color: '#fff' }}>{item.fleet.carName}</span>}
                extra={<span style={{ color: '#aaa' }}>{item.fleet.carType}</span>}
                style={{ backgroundColor: '#1f1f1f', color: '#fff', borderRadius: 12 }}
                actions={[
                  <Tooltip title="Edit" key="edit">
                    <EditOutlined onClick={() => showModal(item)} style={{ color: '#40a9ff' }} />
                  </Tooltip>,
                  <Popconfirm
                    title="Are you sure to delete this item?"
                    onConfirm={() => handleDelete(item.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Tooltip title="Delete" key="delete">
                      <DeleteOutlined style={{ color: '#ff4d4f' }} />
                    </Tooltip>
                  </Popconfirm>
                ]}
              >
                <p><strong>Production Date:</strong> {item.fleet.productionDate}</p>
                <p><strong>Car Miles:</strong> {item.fleet.carMiles}</p>
                <p><strong>Contact:</strong> {item.fleet.contactPhone}</p>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal
          title={editingItem ? 'Edit Fleet' : 'Add Fleet'}
          open={isModalOpen}
          onCancel={handleCancel}
          onOk={() => form.submit()}
          okText="Save"
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="carType" label="Car Type" rules={[{ required: true }]}> 
              <Input />
            </Form.Item>
            <Form.Item name="carName" label="Car Name" rules={[{ required: true }]}> 
              <Input />
            </Form.Item>
            <Form.Item name="productionDate" label="Production Date" rules={[{ required: true }]}> 
              <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="carMiles" label="Car Miles" rules={[{ required: true }]}> 
              <Input />
            </Form.Item>
            <Form.Item name="contactPhone" label="Contact Phone" rules={[{ required: true }]}> 
              <Input placeholder="(90)000-00-00" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default App;