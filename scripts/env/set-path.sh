#!/bin/bash
# This script will look for PATH env varibale and verify it contains a reference to node_modules/.bin.
# If PATH does not contain the reference then ./bash_profile will be sourced and the check will be performed again.
# If PATH does not contain the reference after sourcing ./bash_profile then PATH will be appended with the reference
# and the export will be appended to ./bash_profile.
#
# Sourcing this script should ensure that the PATH value is set and will still be set when a new terminal is started.

# Outputs the project root directory as an absolute path.
#
# @params: $1 - root directory, may be relative
#   default: $(pwd -P), this value should be correct when executing `npm run <script>` or if the this script is sourced
#     from the project root directory.
# @usage -
#   manual: If the script is sourced we cannot determine the scripts location from $0. This script allows the
#     user to provide the root project path as an arugment.
#   bash:  If the path is not provided, $BASH_SOURCE is used to find the scripts location and deduce the root directory
#     in /bin/bash shells. This makes the assumption `<root_dir>/scripts/env/<this-script>`.
#   posix: POSIX compliant shells do not provide a deterministic means of deducing the scripts path; this is a result
#     of the undefined behavior when sourcing the script, ie. `. ./setup-husky.sh`, which will not set $0 to a known
#     value (actual value will vary by shell implementation). For these cases, $1 must be used to pass in the project
#     root. If $1 is not provided or is not a valid directory then an optimistic default will be used.
get_root_dir() {
  get_absolute_path "$1" || get_absolute_path "${BASH_SOURCE[0]}" || get_absolute_path "$(pwd)" || return 1
}

get_absolute_path() {
  valid_directory "$1" && echo "$(cd "$1" || exit $?; pwd -P)"
}

valid_directory() {
  [ -n "$1" ] && [ -d $1 ]
}

source_profile() {
  echo "Sourcing ${bash_profile}"
    # shellcheck source=~\/.bash_profile:~\/.bash_rc
  . "${bash_profile}"
}

path_has_bin() {
  case "$PATH" in
    *${project_bin}*)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

get_appended_path() {
  case "$PATH" in
    *:)
      echo "${PATH}${project_bin}"
      ;;
    *)
      echo "${PATH}:${project_bin}"
      ;;
  esac
}

contains_script() {
  case $(cat ${bash_profile}) in
    *${config_script}*)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

setup_env_path() {
  path_has_bin
  case $? in
    0)
      echo "Found nwm project_bin"
      ;;
    *)
      if [ -n "$1" ]; then
        source_profile
        setup_env_path
      elif [ -n "${NWM_CONFIG}" ]; then
        contains_script || append_to_bash_profile
        update_config
        update_path
      elif contains_script; then
        echo "Not updating path: NWM_CONFIG is unset"
      else
        append_to_bash_profile
        update_config
        update_path
      fi
      ;;
  esac
}

update_path() {
  PATH=$(get_appended_path)
  export PATH
  echo "Updated PATH to ${PATH}"

}

append_to_bash_profile() {
  echo "Appending setup script to ${bash_profile}"
  # TODO -- nicer way to do this that's more DRY? Maybe `$(cat another-script.sh) >> ${bash_profile}`?
  echo "
# NWM project bin config
export NWM_CONFIG=true #remove this line to disable, set-path.sh will not readadd if ${config_script} is found
if [ -n \"\${NWM_CONFIG}\" ]; then
  source ${config_script}
fi" >> "${bash_profile}"
}

update_config() {
    build_path_script > ${config_script}
}

# TODO -- nicer way to do this that's more DRY? Maybe `$(cat another-script.sh) >> ${bash_profile}`?
build_path_script() {
  echo "#!/bin/bash
# NWM project bin config

case "\$PATH" in
  *${project_bin}*) ;;
  *:)
    PATH="${PATH}${project_bin}"
    export PATH
    ;;
  *)
    PATH="${PATH}:${project_bin}"
    export PATH
    ;;
esac
"
}

root_dir=$(get_root_dir "$1")
project_bin=${root_dir}/node_modules/.bin
config_script="${HOME}/.nwmrc"

if [ -z "$PS1" ]; then
  bash_profile=${HOME}/.bash_profile
else
  bash_profile=${HOME}/.bashrc
fi

setup_env_path true