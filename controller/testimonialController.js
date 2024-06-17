const express = require("express");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Testimonial = require("../model/testimonialModel");


const addTestimonial = asyncHandler(async (req, res) => {
  const { data } = req.body;

 try {
  if(data !==null){
    const testimonial = await Testimonial.create({
      user_id: req.user.id,
      data: data,
      auther: req.user.name,
    });
  
    const response = createResponse(
      "success",
      "Testimonial added succesfully!",
      testimonial
    );
    res.status(200).json(response);
  }else{
   
    const response = createResponse(
      "error",
      "Testimonial can not be empty",
      null
    );
    res.status(200).json(response);
  }
 } catch (error) {
  const response = createResponse(
    "error",
    "Error while adding testimonial",
    null
  );
  res.status(200).json(response);
 }
  
});

const fetchTestimonialList = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const testimonials = await Testimonial.find({ user_id });
  
  try {
    
  if (!testimonials.length) {
    const response = createResponse("success", "Testimonial List is found empty!", null);
    res.status(200).json(response);
  } else {
    const response = createResponse(
      "success",
      "Testimonial List fetched succesfully!",
      testimonials
    );
    res.status(200).json(response);
  }
  } catch (error) {
    const response = createResponse("error", "Error while fetching testimonial list!", null);
    res.status(200).json(response);
  }
});



const createResponse = (status, message, data) => {
  return {
    status,
    message,
    data,
  };
};

module.exports = { addTestimonial,fetchTestimonialList };
