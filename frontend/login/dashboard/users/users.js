// =====================================
// CURAMATRIX USER MANAGEMENT
// MONGODB CONNECTED
// =====================================

const API_URL = "http://localhost:5000/api/users";

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

const userRole =
    document.getElementById("userRole");

const userStatus =
    document.getElementById("userStatus");

const userPassword =
    document.getElementById("userPassword");


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
                "Unable to load users"
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
                <td colspan="7"
                    style="
                        text-align:center;
                        padding:30px;
                    ">
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
// SUMMARY
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

            const role =
                displayRole(user.role)
                    .toLowerCase();


            const matchesSearch =
                username.includes(search) ||
                fullName.includes(search) ||
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
                    displayRole(user.role);

                const status =
                    user.isActive
                        ? "Active"
                        : "Inactive";


                return `
                    <tr>

                        <!-- # -->
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
// OPEN ADD USER
// =====================================

addUserBtn.addEventListener(
    "click",
    function () {

        modalTitle.textContent =
            "Add User";

        userForm.reset();

        editUserId.value = "";

        userUsername.disabled = false;

        userPassword.required = true;

        userRole.value =
            "Staff";

        userStatus.value =
            "Active";

        userModal.classList.add(
            "show"
        );

    }
);


// =====================================
// CLOSE MODAL
// =====================================

function closeModal() {

    userModal.classList.remove(
        "show"
    );

    userForm.reset();

    editUserId.value = "";

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
// ADD / EDIT USER
// =====================================

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

        if (!username || !fullName) {

            alert(
                "Username and Full Name are required."
            );

            return;

        }


        // =================================
        // EDIT USER
        // =================================

        if (id) {

            const body = {

                fullName,
                role,
                isActive

            };


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


                if (!data.success) {

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

                console.error(error);

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

            fullName,

            role,

            password,

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
                            JSON.stringify(body)
                    }
                );


            const data =
                await response.json();


            if (!data.success) {

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

            console.error(error);

            alert(
                "Unable to connect to backend."
            );

        }

    }
);


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


    userUsername.value =
        user.username || "";

    // Username should not be changed
    // because it is used for login.
    userUsername.disabled =
        true;


    userName.value =
        user.fullName || "";


    userRole.value =
        displayRole(
            user.role
        );


    userStatus.value =
        user.isActive
            ? "Active"
            : "Inactive";


    userPassword.value = "";

    userPassword.required =
        false;


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
            `Delete user "${user.fullName}"?`
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


        if (!data.success) {

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

        console.error(error);

        alert(
            "Unable to connect to backend."
        );

    }

}


// =====================================
// SEARCH
// =====================================

searchInput.addEventListener(
    "input",
    displayUsers
);


roleFilter.addEventListener(
    "change",
    displayUsers
);


// =====================================
// PASSWORD SHOW / HIDE
// =====================================

const togglePassword =
    document.getElementById(
        "togglePassword"
    );


if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        function () {

            if (
                userPassword.type ===
                "password"
            ) {

                userPassword.type =
                    "text";

                togglePassword.textContent =
                    "🙈";

            } else {

                userPassword.type =
                    "password";

                togglePassword.textContent =
                    "👁️";

            }

        }
    );

}


// =====================================
// DARK MODE
// =====================================

const darkModeBtn =
    document.getElementById(
        "darkModeBtn"
    );


function applyDarkMode() {

    const darkMode =
        localStorage.getItem(
            "curaMatrixDarkMode"
        ) === "true";


    if (darkMode) {

        document.body.classList.add(
            "dark"
        );

    } else {

        document.body.classList.remove(
            "dark"
        );

    }

}


if (darkModeBtn) {

    darkModeBtn.addEventListener(
        "click",
        function () {

            const isDark =
                document.body.classList.contains(
                    "dark"
                );


            localStorage.setItem(
                "curaMatrixDarkMode",
                !isDark
            );


            applyDarkMode();

        }
    );

}


// =====================================
// LOGOUT
// =====================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


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

applyDarkMode();

loadUsers();