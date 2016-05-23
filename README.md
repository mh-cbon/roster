Roster
=====

Create or delete system user accounts in Mac, Linux and Windows.

## Installation

    npm install @mh-cbon/roster --save

## API

```js
var roster = require('@mh-cbon/roster');

roster.exists('username', function(exists) {
  console.log('User exists? ' + exists);
})

roster.create({ user: 'new_guy', full_name: 'The New Guy' }, function(err) {
  if (!err) console.log('Successfully created.')
})

roster.delete('bad_user', function(err) {
  if (!err) console.log('Successfully deleted.')
})

roster.get_groups('bad_user', function(err, groups) {
  err && console.error(err);
  groups && console.log(JSON.stringify(groups, null, 2))
})
```

## As a binary

    npm install @mh-cbon/roster -g

## Usage

```sh
@mh-cbon/roster 0.0.3

Usage: roster [command] [user] [opts]

Commands:

 roster exists [user] [opts]

 roster groups [user] [opts]

 roster create [user] [opts]
   --home|-h       Create the home directory
   --home_dir|-d   Specify the home directory path
   --full_name|-f  Set the user full name
   --user_id|-i    Set the user ID
   --group_id|-g   Set the group ID
   --shell|-s      Set the user shell
   --groups        List of additionals comma separated groups to subscribe

 roster delete [user] [opts]
   --remove|-r     Delete the home directory

Options:

   --json          Print results as JSON
```

## Tests

- install vagrant from the official website
- add vbguest plugin `vagrant plugin install vbguest`
- add wrmi plugin `vagrant plugin install wrmi`
- `sh mocha.sh`

## Credits

Written by Tomás Pollak. MIT licensed.
