import com.hivext.api.Response;
import org.yaml.snakeyaml.Yaml;
import com.hivext.api.core.utils.Transport;

// WordPress Multi-Node LEMP Stack - No LiteSpeed option
var cdnAppid = "c05ffa5b45628a2a0c95467ebca8a0b4test";
var isCDN = jelastic.dev.apps.GetApp(cdnAppid);

var settings = jps.settings;
var fields = {};
for (var i = 0, field; field = jps.settings.fields[i]; i++)
  fields[field.name] = field;

// Check CDN availability
if (isCDN.result == 0 || isCDN.result == Response.PERMISSION_DENIED) {
  fields["cdn-addon"].hidden = false;
  fields["cdn-addon"].value = true;
} else {
  fields["cdn-addon"].hidden = true;
  fields["cdn-addon"].value = false;
}

// Detect if user is a collaboration user by checking script creation permissions
// Collaboration users cannot create scheduled scripts, so we check utils.Scheduler access
var isCollaborationUser = false;
try {
  // Try to list scheduled tasks - only account owners can do this
  var tasksCheck = jelastic.utils.scheduler.GetTasks({});
  // If we get PERMISSION_DENIED or ACCESS_DENIED, user is a collaborator
  if (tasksCheck.result == Response.PERMISSION_DENIED ||
      tasksCheck.result == Response.ACCESS_DENIED ||
      tasksCheck.result == 701 || // Permission denied error code
      tasksCheck.result == 702 || // Access denied error code
      tasksCheck.result == 8) {    // Another permission denied code
    isCollaborationUser = true;
  }
} catch (e) {
  // If the API call fails entirely, assume collaboration user for safety
  isCollaborationUser = true;
}

// Disable Let's Encrypt for collaboration users
if (isCollaborationUser) {
  fields["le-addon"].disabled = true;
  fields["le-addon"].value = false;
  fields["le-addon"].tooltip = "⚠️ Collaboration users cannot install Let's Encrypt during initial deployment due to platform script creation restrictions. Please install Let's Encrypt after deployment using the marketplace addons feature.";
}

return {
    result: 0,
    settings: settings
};
