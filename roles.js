// {"role": [Array of actions]}

var roles = {
	"super-admin": ["add_user", "add_admin", "delete_user", "delete_admin"],
	"admin": ["add_user", "delete_user"]
}

module.exports = roles;