// import React, { Fragment, useEffect } from "react";
// import PropTypes from "prop-types";
//
// function UpdateArticle(props) {
//     const {
//         selectDashboard,
//     } = props;
//     const user = JSON.parse(localStorage.getItem('user'));
//     const isConnected = user !== null;
//     useEffect(selectDashboard, [selectDashboard]);
//    console.log("roro");
//     return (<>
//         <h1>Bienvenue TOTO{user !== null ? user.name : 'unknown'}</h1>
//     </>);
// }
//
// UpdateArticle.propTypes = {
//     CardChart: PropTypes.elementType,
//     statistics: PropTypes.object.isRequired,
//     toggleAccountActivation: PropTypes.func,
//     pushMessageToSnackbar: PropTypes.func,
//     targets: PropTypes.arrayOf(PropTypes.object).isRequired,
//     setTargets: PropTypes.func.isRequired,
//     isAccountActivated: PropTypes.bool.isRequired,
//     selectDashboard: PropTypes.func.isRequired,
// };
//
// export default UpdateArticle;
