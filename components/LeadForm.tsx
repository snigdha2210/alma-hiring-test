"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import styles from "../app/styles/LeadForm.module.css";
import Image from "next/image";
import CountrySelect from "./CountrySelect";

type LeadFormData = {
  firstName: string;
  lastName: string;
  email: string;
  country: CountryOption;
  linkedin: string;
  visas: string[];
  resume: FileList;
  additionalInfo: string;
};
type CountryOption = {
  value: string;
  label: string;
};
const LeadForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LeadFormData>();
  const router = useRouter();

  const onSubmit = async (data: LeadFormData) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    // Append country value if selected
    if (data.country) {
      formData.append("country", data.country.label);
    }
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
      {/* Hero Section with only the logo & heading */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <Image
              src='/images/alma-logo.png'
              alt='Alma Logo'
              width={100}
              height={30}
              className={styles.almaLogo}
            />
          </div>
          {/* Heading */}
          <h1 className={styles.heroTitle}>
            Get An Assessment Of Your Immigration Case
          </h1>
        </div>
      </div>

      {/* The rest of the page content starts here */}
      <div className={styles.mainContent}>
        {/* If we want to keep the subtitle, place it here (left aligned or centered). */}

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.formFields}>
            {/* Icon + Field: Center the icon using .questionIcon */}
            <Image
              src='/images/folder.png'
              alt='First Name Icon'
              width={50}
              height={50}
              className={styles.questionIcon}
            />
            <h4 className={styles.question}>
              Want to understand your visa options?
            </h4>
            <p className={styles.questionContent}>
              Submit the form below and our team of experienced attorneys will
              review your information and send a preliminary assessment of your
              case based on your goals.
            </p>
            <div className={styles.fieldGroup}>
              <input
                className={styles.input}
                {...register("firstName", { required: true })}
                placeholder='First Name'
              />
              {errors.firstName && (
                <p className={styles.errorMessage}>First Name is required</p>
              )}
            </div>

            {/* LAST NAME */}

            <div className={styles.fieldGroup}>
              <input
                className={styles.input}
                {...register("lastName", { required: true })}
                placeholder='Last Name'
              />
              {errors.lastName && (
                <p className={styles.errorMessage}>Last Name is required</p>
              )}
            </div>

            {/* EMAIL */}

            <div className={styles.fieldGroup}>
              <input
                className={styles.input}
                type='email'
                {...register("email", {
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
                placeholder='Email'
              />
              {errors.email && (
                <p className={styles.errorMessage}>Invalid Email</p>
              )}
            </div>

            {/* COUNTRY */}
            {/* Country dropdown */}
            <div className={styles.fieldGroup}>
              <Controller
                control={control}
                name='country'
                rules={{ required: true }}
                render={({ field }) => (
                  <CountrySelect
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.country && (
                <p className={styles.errorMessage}>Country is required</p>
              )}
            </div>
            {/* <div className={styles.fieldGroup}>
              <input
                className={styles.input}
                {...register("country", { required: true })}
                placeholder='Country of Citizenship'
              />
              {errors.country && (
                <p className={styles.errorMessage}>
                  Country of Citizenship is required
                </p>
              )}
            </div> */}

            {/* LINKEDIN */}

            <div className={styles.fieldGroup}>
              <input
                className={styles.input}
                {...register("linkedin", { required: true })}
                placeholder='Linkedin / Personal Website URL'
              />
              {errors.linkedin && (
                <p className={styles.errorMessage}>LinkedIn is required</p>
              )}
            </div>
            {/* RESUME UPLOAD */}
            <div className={styles.fieldGroup}>
              <input
                type='file'
                className={styles.fileInput}
                {...register("resume")}
              />
            </div>

            {/* VISAS */}
            <Image
              src='/images/visa-options.png'
              alt='Visa Icon'
              width={50}
              height={50}
              className={styles.questionIcon}
            />
            <h4 className={styles.question}>Visa categories of interest?</h4>
            <div className={styles.fieldGroup}>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type='checkbox'
                    value='O-1'
                    {...register("visas", { required: true })}
                  />
                  <span>O-1</span>
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type='checkbox'
                    value='H1B'
                    {...register("visas", { required: true })}
                  />
                  <span>H1B</span>
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type='checkbox'
                    value='E-2'
                    {...register("visas", { required: true })}
                  />
                  <span>E-2</span>
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type='checkbox'
                    value='B2'
                    {...register("visas", { required: true })}
                  />
                  <span>B2</span>
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type='checkbox'
                    value='dontknow'
                    {...register("visas", { required: true })}
                  />
                  <span>I don’t know</span>
                </label>
              </div>

              {/* If no checkbox is selected, show an error */}
              {errors.visas && (
                <p className={styles.errorMessage}>
                  Please select at least one visa
                </p>
              )}
            </div>

            {/* ADDITIONAL INFO */}
            <Image
              src='/images/help.png'
              alt='Additional Info Icon'
              width={50}
              height={50}
              className={styles.questionIcon}
            />
            <h4 className={styles.question}>How can we help?</h4>
            <div className={styles.fieldGroup}>
              <textarea
                className={styles.textarea}
                rows={4}
                {...register("additionalInfo", { required: true })}
                placeholder='Tell us more about your immigration goals. What is your current immigration status? What is your past immigration history?'
              />
              {errors.additionalInfo && (
                <p className={styles.errorMessage}>
                  Additional Information is required
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON (black) */}
            <button type='submit' className={styles.submitButton}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadForm;
