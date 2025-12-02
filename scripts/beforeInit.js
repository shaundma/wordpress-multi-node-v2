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

// Detect if user is a collaboration user
// Collaboration users lack permissions to create scheduled scripts
var isCollaborationUser = false;

try {
  // Test if user has permission to create environment scripts
  // Try to check account quotas - collaboration users may have restricted access
  var quotaCheck = jelastic.billing.account.GetQuotas('environment.maxcount');

  // Also try to get account info which might be restricted
  var accountCheck = jelastic.users.account.GetUserInfo();

  // Check if either call indicates collaboration/permission issues
  if (quotaCheck.result == 702 || quotaCheck.result == 701 || quotaCheck.result == 8 ||
      quotaCheck.result == Response.PERMISSION_DENIED || quotaCheck.result == Response.ACCESS_DENIED ||
      accountCheck.result == 702 || accountCheck.result == 701 || accountCheck.result == 8 ||
      accountCheck.result == Response.PERMISSION_DENIED || accountCheck.result == Response.ACCESS_DENIED) {
    isCollaborationUser = true;
  }

  // Additional check: try to access account settings which owners can but collaborators might not
  if (!isCollaborationUser) {
    var settingsCheck = jelastic.billing.account.GetAccount();
    if (settingsCheck.result != 0 && settingsCheck.result != Response.OBJECT_NOT_EXIST) {
      isCollaborationUser = true;
    }
  }
} catch (e) {
  // If any API call fails with permission error, assume collaboration user
  if (e.message && (e.message.indexOf("permission") > -1 || e.message.indexOf("access") > -1)) {
    isCollaborationUser = true;
  }
}

// Update Let's Encrypt tooltip for ALL users with collaboration warning
var originalTooltip = fields["le-addon"].tooltip || "Advanced integration with Let's Encrypt certificate authority that simplifies and automates the process of issuing, configuring and updating trusted custom SSL certificates.";
fields["le-addon"].tooltip = originalTooltip + "\n\n⚠️ Note for Collaboration Users: If you are a collaboration user, you must uncheck this option and add Let's Encrypt after deployment through the marketplace addons feature due to platform script creation restrictions.";

// If detected as collaboration user, disable the checkbox
if (isCollaborationUser) {
  fields["le-addon"].disabled = true;
  fields["le-addon"].value = false;
  fields["le-addon"].tooltip = "⚠️ Collaboration users cannot install Let's Encrypt during initial deployment due to platform script creation restrictions. Please install Let's Encrypt after deployment using the marketplace addons feature.";
}

return {
    result: 0,
    settings: settings
};
