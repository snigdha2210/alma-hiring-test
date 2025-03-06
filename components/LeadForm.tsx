"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import styles from "../app/styles/LeadForm.module.css";

type LeadFormData = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  linkedin: string;
  visas: string[];
  resume: FileList;
  additionalInfo: string;
};

const LeadForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>();
  const router = useRouter();

  const onSubmit = async (data: LeadFormData) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("country", data.country);
    formData.append("linkedin", data.linkedin);
    data.visas.forEach((visa) => formData.append("visas", visa));
    formData.append("additionalInfo", data.additionalInfo);
    if (data.resume?.[0]) {
      formData.append("resume", data.resume[0]);
    }

    try {
      await fetch("/api/leads", { method: "POST", body: formData });
      router.push("/confirmation");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Hero section */}
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          Get An Assessment Of Your Immigration Case
        </h1>
        <p className={styles.heroSubtitle}>
          Submit the form below and our team of experienced attorneys will
          review your information and provide a preliminary assessment of your
          case based on your goals.
        </p>
      </div>

      {/* Form container */}
      <div className={styles.formContainer}>
        {/* Optional second heading inside the form (remove if not needed) */}
        {/* <h2 className={styles.formTitle}>Tell Us About Yourself</h2> */}
        {/* <p className={styles.formInstructions}>Fill in the information below...</p> */}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.formFields}>
          {/* FIRST NAME */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>First Name</label>
            <input
              className={styles.input}
              {...register("firstName", { required: true })}
              placeholder='John'
            />
            {errors.firstName && (
              <p className={styles.errorMessage}>First Name is required</p>
            )}
          </div>

          {/* LAST NAME */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Last Name</label>
            <input
              className={styles.input}
              {...register("lastName", { required: true })}
              placeholder='Doe'
            />
            {errors.lastName && (
              <p className={styles.errorMessage}>Last Name is required</p>
            )}
          </div>

          {/* EMAIL */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type='email'
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+$/i,
              })}
              placeholder='john.doe@example.com'
            />
            {errors.email && (
              <p className={styles.errorMessage}>Invalid Email</p>
            )}
          </div>

          {/* COUNTRY */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Country of Citizenship</label>
            <input
              className={styles.input}
              {...register("country", { required: true })}
              placeholder='e.g. United States'
            />
            {errors.country && (
              <p className={styles.errorMessage}>This field is required</p>
            )}
          </div>

          {/* LINKEDIN */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              LinkedIn / Personal Website URL
            </label>
            <input
              className={styles.input}
              {...register("linkedin", { required: true })}
              placeholder='https://linkedin.com/in/...'
            />
            {errors.linkedin && (
              <p className={styles.errorMessage}>LinkedIn is required</p>
            )}
          </div>

          {/* VISAS (MULTIPLE SELECT) */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Visa categories of interest</label>
            <select
              multiple
              className={styles.select}
              {...register("visas", { required: true })}
            >
              <option value='O-1'>O-1</option>
              <option value='H1B'>H1B</option>
              <option value='E-2'>E-2</option>
              <option value='B2'>B2</option>
              <option value="don't know">I don’t know</option>
            </select>
            {errors.visas && (
              <p className={styles.errorMessage}>
                Please select at least one visa
              </p>
            )}
          </div>

          {/* RESUME UPLOAD */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Resume / CV</label>
            <input
              type='file'
              className={styles.fileInput}
              {...register("resume")}
            />
          </div>

          {/* ADDITIONAL INFO */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>How can we help you?</label>
            <textarea
              className={styles.textarea}
              rows={4}
              {...register("additionalInfo", { required: true })}
              placeholder='Tell us more about your immigration goals...'
            />
            {errors.additionalInfo && (
              <p className={styles.errorMessage}>This field is required</p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button type='submit' className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
