import React from 'react'

const AddCategory = ({ onSubmit }) => {

  const [formData, setFormData] = useState({
    categoryId: "",
    categoryType: "",
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    
  )
}

export default AddCategory
