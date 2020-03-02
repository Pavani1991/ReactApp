import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadCourses, saveCourse } from "../../redux/actions/courseActions";
import { loadAuthors } from "../../redux/actions/authorActions";
import { newCourse } from "../../../tools/mockData";
import CourseForm from "./CourseForm";

function ManageCoursesPage({
  authors,
  courses,
  loadAuthors,
  loadCourses,
  saveCourse,
  history,
  ...props
}) {
  // ... props is used if we did nopt destructure any arguments in the props
  // when to use state and when not to use state
  // use state only when the props are needed by few components, usually form data will not be needed by many components.
  // So, it is better to use states ra ther than storing it in redux store

  const [course, setCourse] = useState({ ...props.course });
  const [errors] = useState();
  useEffect(() => {
    if (courses.length === 0) {
      loadCourses().catch(error => {
        alert("Error Loading Courses" + error);
      });
    } else {
      setCourse({ ...props.course });
    }
    if (authors.length === 0) {
      loadAuthors().catch(error => {
        alert("Error loading authors" + error);
      });
    }
  }, [props.course]); // the second argument is to specify the component to render only if the state changes. Sending emprty argument swill run it only once

  function handleChange(event) {
    const { name, value } = event.target; // event is the synt hetic evenmt, destructuring this code here will get rif of the error iif synthetic event is used in the the setCourse function
    setCourse(prevCourse => ({
      ...prevCourse,
      [name]: name === "authorId" ? parseInt(value, 10) : value
    }));
  }

  function handleSave(event) {
    event.preventDefault();
    saveCourse(course).then(() => {
      history.push("/courses");
    });
  }

  return (
    <CourseForm
      course={course}
      errors={errors}
      authors={authors}
      onChange={handleChange}
      onSave={handleSave}
    />
  );
}

ManageCoursesPage.propTypes = {
  authors: PropTypes.array.isRequired,
  course: PropTypes.object.isRequired,
  courses: PropTypes.array.isRequired,
  loadCourses: PropTypes.func.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  saveCourse: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

function getCourseBySlug(courses, slug) {
  return courses.find(course => course.slug === slug) || null;
}

function mapStateToProps(state, ownProps) {
  // ownProws are the component's props. React sets this props automatically. Here it means we can access routing related props by react router
  const slug = ownProps.match.params.slug;
  const course =
    slug && state.courses.length > 0
      ? getCourseBySlug(state.courses, slug)
      : newCourse;
  return {
    course,
    courses: state.courses,
    authors: state.authors
  };
}

const mapDispatchToProps = {
  loadCourses,
  loadAuthors,
  saveCourse
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageCoursesPage);
