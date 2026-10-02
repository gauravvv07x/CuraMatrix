// =====================================
// CURAMATRIX USER MANAGEMENT
// MONGODB CONNECTED
// =====================================

const API_URL =
    "https://curamatrix-backend.onrender.com/api/users";

let users = [];


// =====================================
// DOM ELEMENTS
// =====================================

const userTableBody =
    document.getElementById("userTableBody");

const searchInput =
    document.getElementById("searchInput");

const roleFilter =
    document.getElementById("roleFilter");

const totalUsers =
    document.getElementById("totalUsers");

const adminUsers =
    document.getElementById("adminUsers");

const pharmacistUsers =
    document.getElementById("pharmacistUsers");

const staffUsers =
    document.getElementById("staffUsers");

const addUserBtn =
    document.getElementById("addUserBtn");

const userModal =
    document.getElementById("userModal");

const modalTitle =
    document.getElementById("modalTitle");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const userForm =
    document.getElementById("userForm");

const editUserId =
    document.getElementById("editUserId");

const userUsername =
    document.getElementById("userUsername");

const userName =
    document.getElementById("userName");

const userEmail =
    document.getElementById("userEmail");

const userRole =
    document.getElementById("userRole");

const userStatus =
    document.getElementById("userStatus");

const userPassword =
    document.getElementById("userPassword");

const togglePassword =
    document.getElementById("togglePassword");

const logoutBtn =
    document.getElementById("logoutBtn");


// =====================================
// LOAD USERS
// =====================================

async function loadUsers() {

    try {

        const response =
            await fetch(API_URL);

        const data =
            await response.json();

        console.log("Users:", data);

        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to load users."
            );

        }

        users =
            data.users || [];

        displayUsers();

        updateSummary();

    } catch (error) {

        console.error(
            "Load users error:",
            error
        );

        userTableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >
                    Unable to load users.
                </td>
            </tr>
        `;

    }

}


// =====================================
// ROLE DISPLAY
// =====================================

function displayRole(role) {

    if (role === "admin") {

        return "Administrator";

    }

    if (role === "pharmacist") {

        return "Pharmacist";

    }

    return "Staff";

}


// =====================================
// ROLE FOR BACKEND
// =====================================

function backendRole(role) {

    if (role === "Administrator") {

        return "admin";

    }

    if (role === "Pharmacist") {

        return "pharmacist";

    }

    return "staff";

}


// =====================================
// ESCAPE HTML
// =====================================

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================
// UPDATE SUMMARY
// =====================================

function updateSummary() {

    totalUsers.textContent =
        users.length;

    adminUsers.textContent =
        users.filter(
            user => user.role === "admin"
        ).length;

    pharmacistUsers.textContent =
        users.filter(
            user => user.role === "pharmacist"
        ).length;

    staffUsers.textContent =
        users.filter(
            user => user.role === "staff"
        ).length;

}


// =====================================
// DISPLAY USERS
// =====================================

function displayUsers() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedRole =
        roleFilter.value;


    const filteredUsers =
        users.filter(user => {

            const username =
                (user.username || "")
                    .toLowerCase();

            const fullName =
                (user.fullName || "")
                    .toLowerCase();

            const email =
                (user.email || "")
                    .toLowerCase();

            const role =
                displayRole(user.role)
                    .toLowerCase();


            const matchesSearch =
                username.includes(search) ||
                fullName.includes(search) ||
                email.includes(search) ||
                role.includes(search);


            const matchesRole =
                selectedRole === "all" ||
                displayRole(user.role) ===
                selectedRole;


            return (
                matchesSearch &&
                matchesRole
            );

        });


    // =================================
    // NO USERS
    // =================================

    if (filteredUsers.length === 0) {

        userTableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >
                    No users found.
                </td>
            </tr>
        `;

        return;
    }


    // =================================
    // DISPLAY USERS
    // =================================

    userTableBody.innerHTML =
        filteredUsers.map(
            (user, index) => {

                const role =
                    displayRole(
                        user.role
                    );

                const status =
                    user.isActive
                        ? "Active"
                        : "Inactive";


                return `
                    <tr>

                        <!-- NUMBER -->
                        <td>
                            ${index + 1}
                        </td>


                        <!-- USERNAME -->
                        <td>
                            <strong>
                                ${escapeHTML(
                                    user.username
                                )}
                            </strong>
                        </td>


                        <!-- FULL NAME -->
                        <td>
                            ${escapeHTML(
                                user.fullName
                            )}
                        </td>


                        <!-- ROLE -->
                        <td>
                            ${role}
                        </td>


                        <!-- STATUS -->
                        <td>
                            ${status}
                        </td>


                        <!-- ACTION -->
                        <td>

                            <button
                                type="button"
                                class="edit-btn"
                                onclick="editUser('${user._id}')"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                class="delete-btn"
                                onclick="deleteUser('${user._id}')"
                            >
                                Delete
                            </button>

                        </td>

                    </tr>
                `;

            }
        ).join("");

}


// =====================================
// OPEN ADD USER MODAL
// =====================================

if (addUserBtn) {

    addUserBtn.addEventListener(
        "click",
        function () {

            modalTitle.textContent =
                "Add User";

            userForm.reset();

            editUserId.value =
                "";

            userUsername.disabled =
                false;

            userPassword.required =
                true;

            userRole.value =
                "Staff";

            userStatus.value =
                "Active";

            if (togglePassword) {

                userPassword.type =
                    "password";

                togglePassword.textContent =
                    "👁️";

            }

            userModal.classList.add(
                "show"
            );

        }
    );

}


// =====================================
// CLOSE MODAL
// =====================================

function closeModal() {

    userModal.classList.remove(
        "show"
    );

    userForm.reset();

    editUserId.value =
        "";

    userUsername.disabled =
        false;

    userPassword.required =
        true;

    if (togglePassword) {

        userPassword.type =
            "password";

        togglePassword.textContent =
            "👁️";

    }

}


if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        closeModal
    );

}


if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        closeModal
    );

}


// =====================================
// CLICK OUTSIDE MODAL
// =====================================

if (userModal) {

    userModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                userModal
            ) {

                closeModal();

            }

        }
    );

}


// =====================================
// ADD / EDIT USER
// =====================================

if (userForm) {

    userForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const id =
                editUserId.value.trim();

            const username =
                userUsername.value.trim();

            const fullName =
                userName.value.trim();

            const email =
                userEmail.value.trim()
                    .toLowerCase();

            const role =
                backendRole(
                    userRole.value
                );

            const isActive =
                userStatus.value ===
                "Active";

            const password =
                userPassword.value.trim();


            // =================================
            // VALIDATION
            // =================================

            if (
                !username ||
                !fullName
            ) {

                alert(
                    "Username and Full Name are required."
                );

                return;

            }


            // Email validation
            // Only required when user
            // wants password recovery.

            if (
                email &&
                !isValidEmail(email)
            ) {

                alert(
                    "Please enter a valid email address."
                );

                userEmail.focus();

                return;

            }


            // =================================
            // EDIT USER
            // =================================

            if (id) {

                const body = {

                    fullName:
                        fullName,

                    email:
                        email,

                    role:
                        role,

                    isActive:
                        isActive

                };


                // Only update password
                // if a new password was entered.

                if (password) {

                    body.password =
                        password;

                }


                try {

                    const response =
                        await fetch(
                            `${API_URL}/${id}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        body
                                    )
                            }
                        );


                    const data =
                        await response.json();


                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        alert(
                            data.message ||
                            "Failed to update user."
                        );

                        return;

                    }


                    alert(
                        "User updated successfully."
                    );

                    closeModal();

                    loadUsers();


                } catch (error) {

                    console.error(
                        "Update user error:",
                        error
                    );

                    alert(
                        "Unable to connect to backend."
                    );

                }

                return;

            }


            // =================================
            // ADD USER
            // =================================

            if (!password) {

                alert(
                    "Password is required."
                );

                return;

            }


            const body = {

                username:
                    username.toLowerCase(),

                fullName:
                    fullName,

                email:
                    email,

                role:
                    role,

                password:
                    password,

                isActive:
                    isActive

            };


            try {

                const response =
                    await fetch(
                        API_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    body
                                )
                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    alert(
                        data.message ||
                        "Failed to add user."
                    );

                    return;

                }


                alert(
                    "User added successfully."
                );

                closeModal();

                loadUsers();


            } catch (error) {

                console.error(
                    "Add user error:",
                    error
                );

                alert(
                    "Unable to connect to backend."
                );

            }

        }
    );

}


// =====================================
// EDIT USER
// =====================================

async function editUser(id) {

    const user =
        users.find(
            u => u._id === id
        );


    if (!user) {

        alert(
            "User not found."
        );

        return;

    }


    modalTitle.textContent =
        "Edit User";


    editUserId.value =
        user._id;


    // Username
    userUsername.value =
        user.username || "";

    // Username cannot be changed
    // because it is used for login.
    userUsername.disabled =
        true;


    // Full Name
    userName.value =
        user.fullName || "";


    // Registered Email
    userEmail.value =
        user.email || "";


    // Role
    userRole.value =
        displayRole(
            user.role
        );


    // Status
    userStatus.value =
        user.isActive
            ? "Active"
            : "Inactive";


    // Password is optional while editing.
    userPassword.value =
        "";

    userPassword.required =
        false;


    if (togglePassword) {

        userPassword.type =
            "password";

        togglePassword.textContent =
            "👁️";

    }


    userModal.classList.add(
        "show"
    );

}


// =====================================
// DELETE USER
// =====================================

async function deleteUser(id) {

    const user =
        users.find(
            u => u._id === id
        );


    if (!user) {

        return;

    }


    const confirmDelete =
        confirm(
            `Delete user "${user.fullName || user.username}"?`
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            alert(
                data.message ||
                "Failed to delete user."
            );

            return;

        }


        alert(
            "User deleted successfully."
        );

        loadUsers();


    } catch (error) {

        console.error(
            "Delete user error:",
            error
        );

        alert(
            "Unable to connect to backend."
        );

    }

}


// =====================================
// SEARCH
// =====================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        displayUsers
    );

}


// =====================================
// ROLE FILTER
// =====================================

if (roleFilter) {

    roleFilter.addEventListener(
        "change",
        displayUsers
    );

}


// =====================================
// PASSWORD SHOW / HIDE
// =====================================

if (
    togglePassword &&
    userPassword
) {

    togglePassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            if (
                userPassword.type ===
                "password"
            ) {

                userPassword.type =
                    "text";

                togglePassword.textContent =
                    "🙈";

                togglePassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                userPassword.type =
                    "password";

                togglePassword.textContent =
                    "👁️";

                togglePassword.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );

}


// =====================================
// EMAIL VALIDATION
// =====================================

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


// =====================================
// LOGOUT
// =====================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "curaMatrixLoggedIn"
            );

            localStorage.removeItem(
                "curaMatrixToken"
            );

            localStorage.removeItem(
                "curaMatrixUser"
            );

            window.location.href =
                "../../login.html";

        }
    );

}


// =====================================
// INITIALIZE
// =====================================

loadUsers();