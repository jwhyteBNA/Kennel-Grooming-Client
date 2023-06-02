import { useState, useEffect } from "react";
import {
  addEmployee,
  updateEmployee,
  getEmployeeById,
} from "../../managers/employees";
import { getLocations } from "../../managers/locations";
import { useParams, useNavigate } from "react-router-dom";

export const EmployeeForm = () => {
  const [locations, setLocations] = useState([]);
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState({});
  const navigate = useNavigate();

  const handleControlledInputChange = (event) => {
    const newEmployee = Object.assign({}, employee);
    newEmployee[event.target.name] = event.target.value;
    setEmployee(newEmployee);
  };

  useEffect(() => {
    getLocations().then((locationsData) => setLocations(locationsData));
  }, []);

  useEffect(() => {
    if (employeeId) {
      getEmployeeById(employeeId).then((res) => {
        setEmployee(res);
      });
    }
  }, [employeeId]);

  const constructNewEmployee = () => {
    const locationId = parseInt(employee.locationId);

    if (locationId === 0) {
      window.alert("Please select a location");
    } else {
      if (employeeId) {
        // PUT
        updateEmployee({
          id: employee.id,
          name: employee.name,
          address: employee.address,
          location_id: locationId,
        }).then(() => navigate("/employees"));
      } else {
        // POST
        addEmployee({
          id: employee.id,
          name: employee.name,
          address: employee.address,
          location_id: locationId,
        }).then(() => navigate("/employees"));
      }
    }
  };

  return (
    <form className="employeeForm">
      <h2 className="employeeForm__title">
        {employeeId ? "Update Employee" : "Create Employee"}
      </h2>
      <fieldset>
        <div className="form-group">
          <label htmlFor="name">Employee name: </label>
          <input
            type="text"
            name="name"
            required
            autoFocus
            className="form-control"
            placeholder="Employee First and Last Name"
            defaultValue={employee.name}
            onChange={handleControlledInputChange}
          />
        </div>
      </fieldset>
      <fieldset>
        <div className="form-group">
          <label htmlFor="breed">Employee Address: </label>
          <input
            type="text"
            name="address"
            required
            className="form-control"
            placeholder="Employee Address"
            defaultValue={employee.address}
            onChange={handleControlledInputChange}
          />
        </div>
      </fieldset>
      <fieldset>
        <div className="form-group">
          <label htmlFor="locationId">Work Location: </label>
          <select
            name="locationId"
            className="form-control"
            value={employee.locationId}
            onChange={handleControlledInputChange}
          >
            <option value="0">Select a location</option>
            {locations.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
      </fieldset>
      <button
        type="submit"
        onClick={(evt) => {
          evt.preventDefault();
          constructNewEmployee();
        }}
        className="btn btn-primary"
      >
        {employeeId ? "Save Updates" : "Create Employee"}
      </button>
    </form>
  );
};
