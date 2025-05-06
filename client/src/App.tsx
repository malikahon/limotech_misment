import './App.css'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {useEffect, useState} from 'react';

function App() {
    const [data, setData] = useState<any>();
    const [isOpen, setIsOpen] = useState<boolean>();
    const [editItem, setEditItem] = useState<any>();

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [alert, setAlert] = useState<{ type: string, message: string } | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const showAlert = (type: string, message: string) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 3000); // Auto-hide
    };

    const fetchData = async () => {
        const res = await axios.get('http://localhost:3000/api/fleet');
        setData(res.data);
    };

    const closeModal = () => {
        setIsOpen(false)
    }
    const openModal = () => {
        setIsOpen(true)
    }

    const editCar = (id: number) => {
        openModal()
        if (id) {
            const foundItem = data.find((item: any) => item.id === id);
            setEditItem(foundItem);
        }
    }

    const deleteCar = async (id: number) => {
        await axios.delete(`http://localhost:3000/api/fleet/${id}`);
        fetchData();
    }

    const addFleet = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target); // Collect all form data
        const fleetData = {
            carType: formData.get('carType'),
            carName: formData.get('carName'),
            productionDate: formData?.get('productionDate'),
            carMiles: formData.get('carMiles'),
            contactPhone: formData.get('contactPhone')
        };
        if (editItem?.id) {
            await axios.put(`http://localhost:3000/api/fleet/${editItem.id}`, editItem.fleet);
            closeModal();
            fetchData();
            showAlert('info', 'Fleet item updated successfully!');  // blue
        } else {
            await axios.post('http://localhost:3000/api/fleet', {...fleetData, productionDate: formatDateForSave(fleetData?.productionDate)});
            closeModal();
            fetchData();
            showAlert('success', 'Fleet item added successfully!');  // green
        }
    };


    const formatDateForSave = (inputStr: any) => {
        if (!inputStr) return '';
        // Input: "2022-03-04T15:59"
        const [datePart, timePart] = inputStr.split('T');
        if (!datePart || !timePart) return '';

        const [year, month, day] = datePart.split('-');
        console.log(`${day}/${month}/${year} ${timePart}`)
        return `${day}/${month}/${year} ${timePart}`; // Save as dd/MM/yyyy HH:mm
    };

    const formatDateForInput = (dateStr: string | undefined) => {
        if (!dateStr) return '';
        // Input: "04/03/2022 15:59"
        const [datePart, timePart] = dateStr.split(' ');
        if (!datePart || !timePart) return '';

        const [day, month, year] = datePart.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timePart}`;
    };

    const openDeleteModal = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteId(null);
        setIsDeleteModalOpen(false);
    };


    return (
        <>
            {alert && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 9999,
                    minWidth: '250px'
                }}>
                    <div className={`alert alert-${alert.type}`} role="alert">
                        {alert.message}
                    </div>
                </div>
            )}
            <div>
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center my-3">
                        <h3>Fleet list</h3>
                        <button className="btn btn-success" onClick={() => {
                            setEditItem({
                                id: '',
                                fleet: {
                                    carType: '',
                                    carName: '',
                                    productionDate: '',
                                    carMiles: '',
                                    contactPhone: ''
                                }
                            });
                            openModal();
                        }}>
                            ➕ Add Fleet
                        </button>
                    </div>
                    <table className="table border text-align-center mt-5">
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>ID</th>
                            <th>Car Type</th>
                            <th>Car name</th>
                            <th>Production type</th>
                            <th>Car miles</th>
                            <th>Contact phone</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            data?.map((item: any, index: number) =>
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.id}</td>
                                    <td>{item.fleet.carType}</td>
                                    <td>{item.fleet.carName}</td>
                                    <td>{item.fleet.productionDate}</td>
                                    <td>{item.fleet.carMiles}</td>
                                    <td>{item.fleet.contactPhone}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-primary"
                                                onClick={() => editCar(item.id)}>edit
                                        </button>
                                        <button className="btn btn-sm mx-1 btn-danger"
                                                onClick={() => openDeleteModal(item.id)}>X
                                        </button>
                                    </td>
                                </tr>)
                        }
                        </tbody>
                    </table>
                </div>
                <Modal isOpen={isOpen} toggle={() => closeModal()}>
                    <ModalHeader>Customer</ModalHeader>
                    <ModalBody>
                        <form id='addCustomer' onSubmit={addFleet}>
                            <label htmlFor="carType">Car Type</label>
                            <input type="text" id='carType' name='carType' className='form-control mb-2'
                                   value={editItem?.fleet.carType} onChange={(e) =>
                                setEditItem((prev: any) => ({
                                    ...prev,
                                    fleet: {
                                        ...prev.fleet,
                                        carType: e.target.value
                                    }
                                }))
                            }/>
                            <label htmlFor="carName">Car Name</label>
                            <label htmlFor="carName">Car Name</label>
                            <input
                                type="text"
                                id="carName"
                                name="carName"
                                className="form-control mb-2"
                                value={editItem?.fleet.carName || ''}
                                onChange={(e) =>
                                    setEditItem((prev: any) => ({
                                        ...prev,
                                        fleet: {
                                            ...prev.fleet,
                                            carName: e.target.value
                                        }
                                    }))
                                }
                            />

                            <label htmlFor="productionDate">Production Date</label>
                            <input
                                type="datetime-local"
                                id="productionDate"
                                name="productionDate"
                                className="form-control mb-2"
                                value={formatDateForInput(editItem?.fleet.productionDate) || ''}
                                onChange={(e) =>
                                    setEditItem((prev: any) => ({
                                        ...prev,
                                        fleet: {
                                            ...prev.fleet,
                                            productionDate: formatDateForSave(e.target.value) // Always save formatted
                                        }
                                    }))
                                }
                            />

                            <label htmlFor="carMiles">Car Miles</label>
                            <input
                                type="text"
                                id="carMiles"
                                name="carMiles"
                                className="form-control mb-2"
                                value={editItem?.fleet?.carMiles || ''}
                                placeholder="Enter Car Miles"
                                onChange={(e) =>
                                    setEditItem((prev: any) => ({
                                        ...prev,
                                        fleet: {
                                            ...prev.fleet,
                                            carMiles: e.target.value
                                        }
                                    }))
                                }
                            />

                            <label htmlFor="contactPhone">Phone Number</label>
                            <input
                                type="text"
                                id="contactPhone"
                                name="contactPhone"
                                className="form-control mb-2"
                                value={editItem?.fleet.contactPhone || ''}
                                placeholder="(90)000-00-00"
                                onChange={(e) =>
                                    setEditItem((prev: any) => ({
                                        ...prev,
                                        fleet: {
                                            ...prev.fleet,
                                            contactPhone: e.target.value
                                        }
                                    }))
                                }
                            />
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <button form='addCustomer' className="btn btn-success">Save</button>
                        <button onClick={() => closeModal()} className="btn btn-danger">Cancel</button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={isDeleteModalOpen} toggle={() => closeDeleteModal()}>
                    <ModalHeader toggle={() => closeDeleteModal()}>Confirm Delete</ModalHeader>
                    <ModalBody>
                        Are you sure you want to delete this fleet item?
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={async () => {
                            if (deleteId) {
                                await deleteCar(deleteId);
                                closeDeleteModal();
                                showAlert('danger', 'Fleet item deleted!');
                            }
                        }}>Yes, Delete
                        </button>
                        <button className="btn btn-secondary" onClick={() => closeDeleteModal()}>Cancel</button>
                    </ModalFooter>
                </Modal>
            </div>
        </>
    )
}

export default App
