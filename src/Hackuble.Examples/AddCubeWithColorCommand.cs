﻿using Hackuble.Commands;

namespace Hackuble.Examples
{
    public class AddCubeWithColorCommand : AbstractCommand
    {
        public override string Name => "Add Cube (Colors)";

        public override string Author => "Hackathon21";

        public override string Description => "Add a cuboid to the scene";

        public override string CommandLineName => "cube-colors";

        public override string Accent => "#FF96AD";

        public override void RegisterInputArguments(DataAccess dataAccess)
        {
            dataAccess.RegisterTextArgument("Color", "The color of the cube in Hex Format", "#FF96AD");
        }

        public override CommandStatus RunCommand(Context context, DataAccess dataAccess)
        {
            string c = "#ffffff";
            if (!dataAccess.GetData<string>(0, ref c))
            {
                return CommandStatus.Failure;
            }

            context.AddCube(0.0, 0.0, 0.0, 20.0, 20.0, 20.0, c);
            return CommandStatus.Success;
        }
    }
}