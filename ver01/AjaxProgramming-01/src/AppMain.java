
public class AppMain {

	public static void main(String[] args) throws Exception {
		System.out.println(">>>>> " + new Object(){}.getClass().getEnclosingClass().getName());
	}
}
