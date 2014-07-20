<!DOCTYPE html>
<html>
<head>
	<title>math lab</title>
	<link rel="stylesheet" type="text/css" href="../css/default.css">
	<script src="../require.js"></script>
	<script type="text/javascript" src="../<?= $_GET['experiment'] ?>/<?= $_GET['experiment'] ?>.js"></script>
	<script type="text/javascript" src="layout.js"></script>
</head>
<body>
	<div>
		<canvas id="canvas"></canvas>
	</div>
	<script type="text/javascript">
		window.onload = function(){
			layout.init("<?= $_GET['experiment'] ?>");
		}
	</script>
</body>
</html>